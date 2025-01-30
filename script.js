const typeSelectElem = document.querySelector("[name=type]");
const contentElem = document.getElementById("content");
const formElem = document.querySelector("form");

const htmlSelectorHtml = `<p>Html Selector</p>
<input name="html-selector" type="text" placeholder="html selector code...">`;

const formOptionHtml = [
    `<p>Time to Start (Seconds)</p>
    <input name="time-to-start" type="text" placeholder="time to start...">`,
    `<p>Times</p>
    <input name="times" type="text" placeholder="times..."/>
    <p>Time Between Clicks (Seconds)</p>
    <input name="time-between" type="text" placeholder="time between clicks...">`,
];

typeSelectElem.onchange = () => {
    contentElem.innerHTML =
        htmlSelectorHtml +
        (typeSelectElem.value === "onetime" ? formOptionHtml[0] : formOptionHtml[1]) +
        "<br>";
};

typeSelectElem.onchange();

formElem.addEventListener("submit", (e) => {
    e.preventDefault();

    const htmlSelector = document.querySelector("[name=html-selector]").value;
    const times = typeSelectElem.value === "onetime" ? 1 : parseInt(document.querySelector("[name=times]").value);
    const delay = typeSelectElem.value === "onetime" ? parseInt(document.querySelector("[name=time-to-start]").value) : parseInt(document.querySelector("[name=time-between]").value);

    chrome.runtime.sendMessage({
        action: "clickElement",
        selector: htmlSelector,
        times,
        delay
    });

    contentElem.innerHTML = `<h3>Success! 👍</h3>`;

    setTimeout(() => {
        typeSelectElem.onchange();
    }, 3000);
});
