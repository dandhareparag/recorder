btn.addEventListener('click', async () => {
    // Query the currently active tab in the current window
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    // Execute a content script on the active tab to get the details of the clicked field
    chrome.tabs.executeScript(tab.id, { code: getClickedFieldDetails });
  
    // Function to be executed in the context of the web page to get field details
    function getClickedFieldDetails() {
      // Get the currently focused (clicked) element
      const activeElement = document.activeElement;
  
      // Function to get the XPath of an element
      function getElementXPath(element) {
        if (!element || !element.tagName) return null;
  
        let xpath = '';
        for (; element && element.nodeType === Node.ELEMENT_NODE; element = element.parentNode) {
          const tagName = element.tagName.toLowerCase();
          let index = 1;
          let hasFollowingSiblings = false;
  
          for (let sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
            if (sibling.nodeType === Node.DOCUMENT_TYPE_NODE) continue;
            if (sibling.tagName === tagName) ++index;
            if (!hasFollowingSiblings && sibling.tagName === tagName) hasFollowingSiblings = true;
          }
  
          const position = (index === 1 && !hasFollowingSiblings) ? '' : `[${index}]`;
          xpath = '/' + tagName + position + xpath;
        }
  
        return xpath;
      }
  
      // Check if the active element is an input, textarea, or select field
      if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'SELECT') {
        const fieldName = activeElement.name || activeElement.id || activeElement.tagName;
        const fieldXPath = getElementXPath(activeElement);
  
        // Log or save the field details
        console.log('Field Name:', fieldName);
        console.log('XPath:', fieldXPath);
      } else {
        console.log('Clicked element is not an input, textarea, or select field.');
      }
    }
  });