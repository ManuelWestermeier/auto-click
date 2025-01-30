const typeSelectElem = document.querySelector("[name=type]");
const contentElem = document.getElementById("content");
const formElem = document.querySelector("form");

const htmlSelectorHtml = `<p>Html Selector</p>
<input name="html-selector" type="text" placeholder="html selector code...">`;

const formOptionHtml = [
    `<p>Time to Start (Secounds)</p>
    <input name="time-to-start" type="text" placeholder="time to start...">`,
    `<p>Times</p>
    <input name="times" type="text" placeholder="times..."/>
    <p>Time between (Secounds)</p>
    <input name="time-between" type="text" placeholder="time between...">`,
];

typeSelectElem.onchange = () => {
    contentElem.innerHTML = htmlSelectorHtml + (typeSelectElem.value == "onetime" ? formOptionHtml[0] : formOptionHtml[1]) + "<br>";
    const selector = document.querySelector("[name=html-selector]");
    selector.addEventListener("change", () => {
        const elem = document.querySelector(selector);
        const oldBorderStyle = elem.style.border;

        elem.style.border = "10px solid green";

        setTimeout(() => {
            elem.style.border = oldBorderStyle;
        }, 1000);
    });
}

typeSelectElem.onchange();

formElem.addEventListener("submit", e => {
    e.preventDefault();

    if (typeSelectElem.value == "onetime") {
        const [htmlSelector, timeToStart] = document.querySelectorAll("input");
        const elem = document.querySelector(htmlSelector.value);

        if (!elem) return alert("Error: elem '" + htmlSelector.value + "' not found");

        setTimeout(() => {
            elem.click();
        }, parseInt(timeToStart) * 1000);
    } else {
        const [htmlSelector, _times, timeBetween] = document.querySelectorAll("input");
        const elem = document.querySelector(htmlSelector.value);
        let times = parseInt(_times.value);

        if (!elem) return alert("Error: elem '" + htmlSelector.value + "' not found");

        const interval = setInterval(() => {
            if (times-- < 0) {
                clearInterval(interval);
                return;
            }
            elem.click();
        }, parseInt(timeBetween.value) * 1000);
    }

    contentElem.innerHTML = `<h3>Suceed!👍</h3>`;

    setTimeout(() => {
        typeSelectElem.onchange();
    }, 3000);
});