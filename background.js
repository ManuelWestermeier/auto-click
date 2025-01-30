chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "clickElement") {
        // Find the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs.length) return;
            const tabId = tabs[0].id; // Get the active tab ID

            chrome.scripting.executeScript({
                target: { tabId },
                function: clickElement,
                args: [message.selector, message.times, message.delay]
            });
        });
    }
});

function clickElement(selector, times, delay) {
    const elem = document.querySelector(selector);
    if (!elem) {
        alert("Error: Element '" + selector + "' not found.");
        return;
    }

    let count = 0;
    const interval = setInterval(() => {
        if (count++ >= times) {
            clearInterval(interval);
            return;
        }
        elem.click();
    }, delay * 1000);
}
