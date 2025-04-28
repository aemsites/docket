/**
 * Creates a structured unordered list from heading elements
 * @returns {HTMLElement|null} The created list or null if no headings found
 */
export default function init(el) {
  const mainElement = document.querySelector('main');
  if (!mainElement) return;

  const headings = Array.from(mainElement.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  if (headings.length === 0) return;

  const headingData = headings.map((heading) => {
    const a = document.createElement('a');
    a.href = `#${heading.id}`;
    a.textContent = heading.textContent;
    const li = document.createElement('li');
    li.append(a);

    return {
      level: parseInt(heading.tagName.charAt(1), 10),
      element: li,
    };
  });

  // Create the main unordered list
  const rootUl = document.createElement('ul');

  // Process each heading to build the hierarchy
  for (let i = 0; i < headingData.length; i += 1) {
    const current = headingData[i];

    // If this is the first heading or a top-level heading
    if (i === 0) {
      const ul = document.createElement('ul');
      current.element.innerText = 'On this page';
      rootUl.appendChild(current.element);
      current.element.appendChild(ul);
      current.childList = ul;
    } else {
      // Find the appropriate parent heading
      let j = i - 1;
      while (j >= 0 && headingData[j].level >= current.level) {
        j -= 1;
      }

      if (j >= 0) {
        // Ensure parent has a child list
        if (!headingData[j].childList) {
          const ul = document.createElement('ul');
          headingData[j].element.appendChild(ul);
          headingData[j].childList = ul;
        }
        headingData[j].childList.appendChild(current.element);
      } else {
        // No parent found, add to root
        rootUl.appendChild(current.element);
      }
    }
  }

  el.append(rootUl);
}
