chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "clickElement") {
        const elem = document.querySelector(message.selector);
        if (!elem) {
            alert("Error: Element '" + message.selector + "' not found.");
            return;
        }

        let count = 0;
        const interval = setInterval(() => {
            if (count++ >= message.times) {
                clearInterval(interval);
                return;
            }
            elem.click();
        }, message.delay * 1000);
    }
});
