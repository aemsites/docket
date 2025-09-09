#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const { URL } = require("url");

function fetch(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;

    const request = client.get(url, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        return;
      }

      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        resolve(data);
      });
    });

    request.on("error", (err) => {
      reject(err);
    });
  });
}

function saveHtmlFile(config, pagePath, content, lastModified) {
  const fileName =
    pagePath === "/" ? "index.html" : `${pagePath.replace(/\//g, "_")}.html`;
  const filePath = path.join(config.outputDir, fileName);

  // Convert Unix timestamp to ISO format
  // Create the meta tag for last-modified with pagefind sort attribute
  const isoDate = new Date(lastModified * 1000).toISOString();
  const lastModifiedMeta = `<meta name="last-modified" content="${isoDate}" data-pagefind-sort="date[content]">`;


  // Insert the meta tag and modify canonical link
  let modifiedContent = content;

  // First, add the last-modified meta tag
  const headEndIndex = content.indexOf("</head>");
  if (headEndIndex !== -1) {
    modifiedContent =
      content.substring(0, headEndIndex) +
      `${lastModifiedMeta}\n` +
      content.substring(headEndIndex);
  }

  // Add the filters meta tags
  if (config.filters?.length > 0) {
    // for each filter, find the meta tag in the head and add the filter data attribute
    config.filters.forEach(filter => {
      const tagRegex = new RegExp(`<meta name="${filter}" content="([^"]*)">`);
      if (tagRegex.test(modifiedContent)) {
        modifiedContent = modifiedContent.replace(
          tagRegex,
          (match, contentValue) =>
            `<meta name="${filter}" content="${contentValue}" data-pagefind-filter="${filter}[content]">`
        );
      }
    });
  }

  // Create the canonical URL for this page
  const canonicalUrl = `${config.baseUrl}${pagePath}`;

  // Then, find and modify the canonical link to include data-pagefind-meta
  const canonicalRegex = /<link rel="canonical" href="[^"]*">/;
  if (canonicalRegex.test(modifiedContent)) {
    modifiedContent = modifiedContent.replace(
      canonicalRegex,
      `<link rel="canonical" href="${canonicalUrl}" data-pagefind-meta="url[href]">`
    );
  } else {
    // If no canonical link exists, add one with the pagefind meta
    const headEndIndex2 = modifiedContent.indexOf("</head>");

    if (headEndIndex2 !== -1) {
      modifiedContent =
        modifiedContent.substring(0, headEndIndex2) +
        ` <link rel="canonical" href="${canonicalUrl}" data-pagefind-meta="url[href]">\n` +
        modifiedContent.substring(headEndIndex2);
    }
  }

  // Save the modified HTML content
  fs.writeFileSync(filePath, modifiedContent);
  console.log(`Saved: ${fileName} (last modified: ${isoDate})`);
}

/**
 * Ensure directory exists
 * @param {string} dir - Directory path
 */
async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Load configuration from file
 * @param {string} configPath - Path to the configuration file
 * @returns {Object} - Configuration object
 */
function loadConfig(configPath) {
  try {
    const configData = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    console.error(`Error loading config file ${configPath}:`, error.message);
    process.exit(1);
  }
}

/**
 * Main function to fetch pages and prepare for Pagefind
 */
async function main() {
  try {
    // Get config file path from command line arguments
    const configPath = process.argv[2] || path.join(__dirname, 'indexer-config.json');
    
    // Load configuration
    const config = loadConfig(configPath);
    if (!config.baseUrl || !config.indexUrl || !config.outputDir) {
      throw new Error("baseUrl, indexUrl, and outputDir are required in the config file");
    }
    console.log(`Using config from: ${configPath}`);

    // fetch the query index
    const indexData = await fetch(config.indexUrl);
    const index = JSON.parse(indexData);
    if (!index.data || !Array.isArray(index.data)) {
      throw new Error("Unexpected AEM index format");
    }
    console.log(`Found ${index.data.length} pages to process`);

    // Create output directory and process each page
    await ensureDir(config.outputDir);
    const aemIndex = index.data;
    const results = [];
    for (let i = 0; i < aemIndex.length; i++) {
      const page = aemIndex[i];
      const pagePath = page.path;

      // Skip release notes pages
      if (config.skipPatterns.some(pattern => pagePath.startsWith(pattern))) {
        console.log(`Skipping path: ${pagePath}`);
        results.push({
          pagePath,
          status: "skipped",
        });
        continue;
      }

      try {
        // track progress
        const progress = ((i + 1) / aemIndex.length * 100).toFixed(1);
        console.log(`[${i + 1}/${aemIndex.length}] (${progress}%) Fetching: ${pagePath}`);

        // Construct the full URL
        const pageUrl = `${config.baseUrl}${pagePath}`;

        // Fetch the HTML content
        const htmlContent = await fetch(pageUrl);

        // Save to file with lastModified timestamp
        saveHtmlFile(config, pagePath, htmlContent, page.lastModified);
        results.push({
          pagePath,
          status: "success",
        });

        // Add a small delay to be respectful to the server
        if (i < aemIndex.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, config.delay));
        }
      } catch (error) {
        console.error(`Error fetching ${pagePath}:`, error.message);
        results.push({
          pagePath,
          status: "error",
          error: error.message,
        });
      }
    }

    console.log("\nFetch Summary:");
    console.log(`  Total pages: ${aemIndex.length}`);
    console.log(`  Successful: ${results.filter((r) => r.status === "success").length}`);
    console.log(`  Skipped: ${results.filter((r) => r.status === "skipped").length}`);
    console.log(`  Failed: ${results.filter((r) => r.status === "error").length}`);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  main();
}
