// JavaScript - popup.js
const btn = document.querySelector('.startrecording');

let xx = '';

btn.addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: startRecording
  }, (injectionResult) => {
    console.log(injectionResult);
  });
  console.log("Recording has been started...");
});

// Send XPath data to the background script
function sendXPathToBackground(xpath) {
  chrome.runtime.sendMessage({ xpath: xpath }, (response) => {
    console.log('Received response from background:', response);
  });
}

function startRecording() {
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

  function highlightElement(element) {
    const originalBorderColor = element.style.borderColor;
    element.style.border = '2px solid red';
    setTimeout(() => {
      element.style.border = originalBorderColor;
    }, 2000);
  }

  function sendXPathToServer(xpath) {
    const url = 'http://localhost:3000/storexpath';
    const data = { xpath };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Server response:', data);
      })
      .catch(error => {
        console.error('Error sending XPath to server:', error);
      });
  }

  function handleClick(event) {
    event.stopPropagation();
    const targetElement = event.target;
    const xpath = getElementXPath(targetElement);
    console.log('xpath : ',xpath)
    highlightElement(targetElement);
    sendXPathToServer(xpath); // Correct function name
  }

  document.querySelectorAll('*').forEach(element => {
    element.addEventListener('click', handleClick);
  });

  console.log('Click on any element to get its XPath...');
}

// Call the startRecording function when the extension popup is opened
startRecording();
