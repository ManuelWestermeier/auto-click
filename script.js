const typeSelectElem = document.querySelector("[name=type]");
const contentElem = document.getElementById("content");
const formElem = document.querySelector("form");
const lastQueriesList = document.querySelector("ul");

const htmlSelectorHtml = `
    <p>HTML Selector</p>
    <input name="html-selector" type="text" placeholder="HTML selector code...">
`;

const formOptionHtml = [
    `
    <p>Time to Start (Seconds)</p>
    <input name="time-to-start" type="text" placeholder="time to start...">
    `,
    `
    <p>Times</p>
    <input name="times" type="text" placeholder="times..."/>
    <p>Time Between Clicks (Seconds)</p>
    <input name="time-between" type="text" placeholder="time between clicks...">
    `,
];

// ✅ Load saved settings from storage
chrome.storage.local.get(["type", "selector", "timeStart", "times", "timeBetween", "history"], (data) => {
    if (data.type) typeSelectElem.value = data.type;
    typeSelectElem.onchange();

    setTimeout(() => {
        document.querySelector("[name=html-selector]").value = data.selector || "";
        if (data.type === "onetime") {
            document.querySelector("[name=time-to-start]").value = data.timeStart || "";
        } else {
            document.querySelector("[name=times]").value = data.times || "";
            document.querySelector("[name=time-between]").value = data.timeBetween || "";
        }
    }, 100);

    // ✅ Populate history list
    if (data.history) {
        data.history.forEach((entry) => addHistoryItem(entry));
    }
});

// ✅ Update UI when dropdown changes
typeSelectElem.onchange = () => {
    contentElem.innerHTML =
        htmlSelectorHtml +
        (typeSelectElem.value === "onetime" ? formOptionHtml[0] : formOptionHtml[1]) +
        "<br>";  // Ensure form elements are at the top
};

typeSelectElem.onchange();

// ✅ Handle form submission
formElem.addEventListener("submit", (e) => {
    e.preventDefault();

    const htmlSelector = document.querySelector("[name=html-selector]").value;
    const times = typeSelectElem.value === "onetime" ? 1 : parseInt(document.querySelector("[name=times]").value);
    const delay = typeSelectElem.value === "onetime" ? parseInt(document.querySelector("[name=time-to-start]").value) : parseInt(document.querySelector("[name=time-between]").value);

    if (!htmlSelector) {
        alert("Please enter a valid HTML selector!");
        return;
    }

    // ✅ Save settings in storage
    chrome.storage.local.get("history", (data) => {
        let history = data.history || [];
        history.unshift({
            type: typeSelectElem.value,
            selector: htmlSelector,
            timeStart: document.querySelector("[name=time-to-start]")?.value || "",
            times: document.querySelector("[name=times]")?.value || "",
            timeBetween: document.querySelector("[name=time-between]")?.value || "",
        });

        // ✅ Keep only the last 10 entries
        if (history.length > 10) history.pop();

        chrome.storage.local.set({
            type: typeSelectElem.value,
            selector: htmlSelector,
            timeStart: document.querySelector("[name=time-to-start]")?.value || "",
            times: document.querySelector("[name=times]")?.value || "",
            timeBetween: document.querySelector("[name=time-between]")?.value || "",
            history
        });

        addHistoryItem(history[0]);
    });

    // ✅ Show "Processing..." message
    contentElem.innerHTML = "<h3>Processing... ⏳</h3>";

    // ✅ Send request to background.js and wait for response
    chrome.runtime.sendMessage(
        {
            action: "clickElement",
            selector: htmlSelector,
            times,
            delay
        },
        (response) => {
            if (response?.success) {
                contentElem.innerHTML = `<h3>✅ Success! Clicked:</h3><p>${response.selector}</p>`;
            } else {
                contentElem.innerHTML = `<h3>❌ Error: ${response?.error || "Unknown error"}</h3>`;
            }
            setTimeout(() => {
                typeSelectElem.onchange();
            }, 2000);
        }
    );
});

// ✅ Add past selections to list
function addHistoryItem(entry) {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${entry.type}</strong> - ${entry.selector}`;
    li.addEventListener("click", () => {
        typeSelectElem.value = entry.type;
        typeSelectElem.onchange();

        setTimeout(() => {
            document.querySelector("[name=html-selector]").value = entry.selector;
            if (entry.type === "onetime") {
                document.querySelector("[name=time-to-start]").value = entry.timeStart;
            } else {
                document.querySelector("[name=times]").value = entry.times;
                document.querySelector("[name=time-between]").value = entry.timeBetween;
            }
        }, 100);
    });

    lastQueriesList.prepend(li);
}
