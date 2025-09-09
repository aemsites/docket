import { getConfig } from '../../scripts/nx.js';


const { codeBase } = getConfig();

/**
 * Decorates the search panel with input and results functionality
 * @param {Element} container The container element for the search panel
 */
export default function decorateSearchPanel(container) {
  container.innerHTML = '';

  // const searchPanel = document.createElement('div');
  // searchPanel.id = 'search';
  // container.append(searchPanel);

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'search-input';
  searchInput.placeholder = 'Search';
  searchInput.classList.add('header-search-input');
  container.append(searchInput);

  // Create results container
  const resultsPanel = document.createElement('div');
  resultsPanel.id = 'search-results';
  resultsPanel.classList.add('search-results');
  container.append(resultsPanel);

  // Create individual result element
  const createResultElement = (data) => {
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('search-result-item');

    const title = data.meta?.title || data.url || 'Untitled';
    const excerpt = data.excerpt || data.content || 'No description available';
    const url = data.meta?.url || data.url || '#';

    resultDiv.innerHTML = `
      <a href="${url}" target="_blank">
        <h4>${title}</h4>
        <p>${excerpt}</p>
      </a>
    `;
    return resultDiv;
  };

  // Display search results
  const displaySearchResults = async (searchResults, query) => {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';

    if (!searchResults || searchResults.results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-no-results">
          <p>No results found for "${query}"</p>
        </div>
      `;
      return;
    }

    // Create results header
    const resultsHeader = document.createElement('div');
    resultsHeader.classList.add('search-results-header');
    resultsHeader.innerHTML = `
      <h3>Search Results for "${query}" (${searchResults.results.length} found)</h3>
    `;
    resultsContainer.append(resultsHeader);

    // Process and display results
    const results = searchResults.results.slice(0, 5);
    // eslint-disable-next-line no-restricted-syntax
    for (const result of results) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const data = await result.data();
        const resultElement = createResultElement(data, result);
        resultsContainer.append(resultElement);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error processing result:', error);
      }
    }
  };

  const clearSearchResults = () => {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';
  };

  const displaySearchError = () => {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = `
      <div class="search-error">
        <p>Sorry, there was an error performing the search. Please try again.</p>
      </div>
    `;
  };

  // Debounce function to limit search frequency
  let searchTimeout;
  const debounceSearch = (callback, delay) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(callback, delay);
  };

  // Search handler
  const handleSearch = async (query) => {
    // load pagefind on the inital search
    if (!window.hlx.pagefind) {
      window.hlx.pagefind = await import(
        `${codeBase}/index/pagefind.js`
      );
    }

    try {
      if (query.length >= 2) {
        // eslint-disable-next-line no-console
        console.log(`Searching for: "${query}"`);
        // for the mini search, we want to exclude release notes
        const searchResults = await window.hlx.pagefind.search(query, {
          filters: {
            not: {
              type: ['Release Notes'],
            },
          },
        });
        displaySearchResults(searchResults, query);
      } else {
        clearSearchResults();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Search error:', error);
      displaySearchError();
    }
  };

  // Add input event listener with debouncing
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query?.length === 0) {
      clearSearchResults();
      return;
    }

    if (window.hlx.pagefind) {
      window.hlx.pagefind.preload(query);
    }
    debounceSearch(() => handleSearch(query), 300); // 300ms delay
  });

  searchInput.addEventListener('focus', async (e) => {
    document.body.classList.add('search-focused');

    // load pagefind on the initial search
    if (!window.hlx.pagefind) {
      window.hlx.pagefind = await import(
        `${codeBase}/index/pagefind.js`
      );
    }

    // If there's text in the input and no results showing, trigger search
    const query = e.target.value.trim();
    if (query.length >= 2 && resultsPanel.innerHTML === '') {
      handleSearch(query);
    }
  });

  // handle docuument blur and un-blur
  searchInput.addEventListener('blur', () => {
    document.body.classList.remove('search-focused');
  });

  document.addEventListener('click', (e) => {
    const searchContainer = document.querySelector('header .section.search-section');
    if (searchContainer && !searchContainer.contains(e.target)) {
      clearSearchResults();
      document.body.classList.remove('search-focused');
    }
  });

  // Prevent search results from closing when clicking inside them
  resultsPanel.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}
