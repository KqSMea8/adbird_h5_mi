
function panelInit() {
    chrome.devtools.panels.create("MySniffer", "icons/logo_48.png", "panel.html",
        function () {
            ///TODO
        }
    );
}

window.onload = function () {
    panelInit();
}

window.onbeforeunload = function () {
    //TODO
}