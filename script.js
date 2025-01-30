const typeSelectElem = document.querySelector("[name=type]");
const contentElem = document.getElementById("content");
const formElem = document.querySelector("form");

const htmlSelectorHtml = `<p>Html Selector</p>
<input name="html-selector" type="text" placeholder="html selector code...">`;

const formOptionHtml = [
    `<p>Time to Start</p>
    <input name="time-to-start" type="text" placeholder="time to start...">`,
    `<p>Times</p>
    <input name="times" type="text" placeholder="times..."/>
    <p>Time between</p>
    <input name="time-between" type="text" placeholder="time between...">`,
];

typeSelectElem.onchange = () => {
    contentElem.innerHTML = htmlSelectorHtml + (typeSelectElem.value == "onetime" ? formOptionHtml[0] : formOptionHtml[1]) + "<br>";
}

typeSelectElem.onchange();