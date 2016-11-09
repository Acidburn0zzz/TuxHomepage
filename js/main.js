"use strict";

/* CORE */

/* Default vars */
var defaultDistrib = "ubuntu";
var defaultEngine = "qwant";
var defaultLanguage = "en";

/* Use cookies if defined, else use default values */
var distrib = Cookies.get("distrib") ? Cookies.get("distrib") : defaultDistrib;
var engine = Cookies.get("engine") ? Cookies.get("engine") : defaultEngine;
var language = Cookies.get("language") ? Cookies.get("language") : defaultLanguage;

/* Read JSON file, then call callback function */
function loadJSON(filename, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", "data/" + filename, true);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            callback(JSON.parse(this.response));
        } else {
            alert("Unable to download json data...");
        }
    };
    request.onerror = function() {
        alert("Unable to download json data...");
    };
    request.send();
}

/* Create links in navbar */
function createLinks(json) {
    var links = document.querySelectorAll(".link");
    var lang = json.hasOwnProperty(language) ? language : defaultLanguage;
    Object.keys(json[lang]).forEach(function (key, index) {
        links[index].setAttribute("href", json[lang][key]);
        links[index].textContent = key;
    });
}

/* Change distrib elements */
function changeDistrib(json) {
    var logo = document.getElementById("logo-img");
    /* Change if new distrib is not current distrib */
    if (distrib !== logo.className) {
        /* Change logo of distrib */
        logo.setAttribute("src", "img/" + json[distrib].name.toLowerCase() + "-logo.png");
        logo.className = distrib;
        /* Change color of search div */
        document.getElementById("search").style.backgroundColor = "#" + json[distrib].main_color;
        /* Change colors of links in navbar */
        var links = document.querySelectorAll("#navbar a");
        for (var i = 0; i < links.length; i++) {
            links[i].style.color = "#" + json[distrib].main_color;
        }
        /* Change specific distrib links */
        var website = document.querySelector(".website");
        website.setAttribute("href", json[distrib].website);
        var doc = document.querySelector(".doc");
        doc.setAttribute("href", json[distrib].doc);
        /* Set distrib cookie with new value */
        Cookies.set("distrib", distrib, {expires: 365, path: "/"});
    }
}

/* Change search elements */
function changeEngine(json) {
    var engineCircle = document.getElementById("engine");
    /* Change if new engine is not current engine */
    if (engine !== engineCircle.className) {
        /* Set parameters to do search */
        document.getElementById("form-search").setAttribute("action", json[engine].url);
        document.querySelector("input[type='search']").setAttribute("name", json[engine].parameter);
        engineCircle.className = engine;
        /* Change style of engine circle */
        engineCircle.style.backgroundColor = "#" + json[engine].colors.circle;
        engineCircle.style.color = "#" + json[engine].colors.font;
        engineCircle.textContent = engine.charAt(0).toUpperCase();
        /* Set engine cookie with new value */
        Cookies.set("engine", engine, {expires: 365, path: "/"});
    }
}

/* Translate webpage */
function changeLanguage(json) {
    /* Change lang of languages select */
    var options = document.querySelectorAll("#languages option");
    for (var i = 0; i < options.length; i++) {
        options[i].textContent = json[language][options[i].value];
    }
    /* Change lang of search input placeholder */
    document.querySelector("#input-search input").placeholder = json[language]["placeholder"];
    /* Change lang of all texts */
    var elts = [];
    elts["doc"] = ".doc";
    elts["website"] = ".website";
    elts["about"] = "#about-modal .modal-header";
    elts["author"] = "#about-modal #author-text";
    elts["description"] = "#about-modal #description-text";
    elts["license"] = "#about-modal #license-text";
    elts["github"] = "#about-modal #github-text";
    elts["thanks"] = "#about-modal #thanks-text";
    elts["contributors"] = "#about-modal #contributors-text";
    elts["close"] = "#about-modal #close-text";
    Object.keys(elts).forEach(function (key) {
        document.querySelector(elts[key]).textContent = json[language][key];
    });
    Cookies.set("language", language, {expires: 365, path: "/"});
}

/* Fill select */
function fillSelect(data) {
    var select = document.querySelector("#" + data[0]);
    data[1].forEach(function (elt) {
        var option = document.createElement("option");
        option.value = elt.toLowerCase();
        option.textContent = elt;
        select.appendChild(option);
    });
    /* Select current value */
    var name = data[0].substr(0, data[0].length - 1);
    select.value = window[name];
}

/* Handle distribs */
function initDistribs(json) {
    var distribs = [];
    Object.keys(json).forEach(function (key) {
        distribs.push(json[key].name);
    });

    fillSelect(["distribs", distribs]);
    changeDistrib(json);
}

/* Handle engines */
function initEngines(json) {
    var engines = [];
    Object.keys(json).forEach(function (key) {
        engines.push(json[key].name);
    });

    fillSelect(["engines", engines]);
    changeEngine(json);
}

/* Handle languages */
function initLanguages(json) {
    var languages = [];
    Object.keys(json).forEach(function (key) {
        languages.push(key);
    });

    fillSelect(["languages", languages]);
    changeLanguage(json);
}

/* INIT WEBPAGE */
loadJSON("links.min.json", createLinks);
loadJSON("distribs.min.json", initDistribs);
loadJSON("engines.min.json", initEngines);
loadJSON("translations.min.json", initLanguages);

/* SELECTS ONCHANGE */
document.getElementById("distribs").onchange = function () {
    distrib = this.value;
    loadJSON("distribs.min.json", changeDistrib);
};

document.getElementById("engines").onchange = function () {
    engine = this.value;
    loadJSON("engines.min.json", changeEngine);
};

document.getElementById("languages").onchange = function () {
    language = this.value;
    loadJSON("translations.min.json", changeLanguage);
    loadJSON("links.min.json", createLinks);
};
