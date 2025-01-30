chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "elementFound") {
        chrome.storage.local.set({ lastSuccess: message.selector });
        chrome.runtime.sendMessage({ action: "showSuccess", selector: message.selector });
    } else if (message.action === "elementNotFound") {
        chrome.runtime.sendMessage({ action: "showError", selector: message.selector });
    }
});
