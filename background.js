chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "clickElement") {
        // ✅ Get the current active tab if `sender.tab.id` is missing
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tabId = sender.tab?.id || (tabs.length ? tabs[0].id : null);
            if (!tabId) {
                console.error("No active tab found.");
                sendResponse({ success: false, error: "No active tab found" });
                return;
            }

            chrome.scripting.executeScript(
                {
                    target: { tabId },
                    func: clickElement,
                    args: [message.selector, message.times, message.delay],
                },
                (result) => {
                    if (chrome.runtime.lastError) {
                        console.error("Script Execution Error:", chrome.runtime.lastError);
                        sendResponse({ success: false, error: chrome.runtime.lastError.message });
                        return;
                    }

                    if (!result || !result[0]?.result) {
                        console.error("Element Not Found:", message.selector);
                        sendResponse({ success: false, error: `Element '${message.selector}' not found` });
                        return;
                    }

                    sendResponse({ success: true, selector: message.selector });
                }
            );
        });

        return true; // ✅ Required to keep `sendResponse` alive for async operations
    }
});

// ✅ Function executed inside the webpage
function clickElement(selector, times, delay) {
    return new Promise((resolve) => {
        const elem = document.querySelector(selector);
        if (!elem) {
            return resolve(false);
        }

        let count = 0;
        const interval = setInterval(() => {
            if (count >= times) {
                clearInterval(interval);
                resolve(true);
            } else {
                elem.click();
                count++;
            }
        }, delay * 1000);
    });
}
