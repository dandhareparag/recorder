// JavaScript - background.js
// Initialize an empty object to store the XPath data
let xpathData = {};

// Function to handle messages from the content script
function handleContentScriptMessage(message, sender, sendResponse) {
  if (message.elementName && message.xpath) {
    console.log('Received message from content script:', message);
    // Update the xpathData object with the new element and its corresponding XPath
    xpathData[message.elementName] = message.xpath;
    console.log('Updated xpathData:', xpathData);
    // Save the updated data in chrome.storage.sync (optional, depending on your needs)
    chrome.storage.sync.set({ xpathData }, () => {
      console.log('XPath data saved to storage:', xpathData);
    });

    // Send the XPaths to the server
    sendXPathsToServer(message.xpath);
    setTimeout(() => {
      fetchTableContent();
    }, 2000); 
  }
}

// Listen for messages from the content script
chrome.runtime.onMessage.addListener(handleContentScriptMessage);

// Function to send the XPaths to the server using Fetch API
function sendXPathsToBackground(xpaths) {
  chrome.runtime.sendMessage({ elementName: 'exampleElement', xpath: xpaths }, () => {
    // Optional callback function to handle response (if needed).
    console.log('XPaths sent to background script.');
  });
}

function sendXPathsToServer(xpaths) {
  const url = 'http://localhost:3000/storexpath'; 
  const data = { xpath: xpaths };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Server response:', data);
    })
    .catch(error => {
      console.error('Error sending XPaths to server:', error);
    });
}
// Function to handle messages from the popup script
function handlePopupMessage(message, sender, sendResponse) {
  if (message.xpath) {
    console.log('Received XPath from popup:', message.xpath);
    // Send the received XPaths to the server
    sendXPathsToServer(message.xpath);
  }
}

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(handlePopupMessage);