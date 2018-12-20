
function panelInit() {
    chrome.devtools.panels.create("ADBGameSniffer", "icons/logo_48.png", "panel.html",
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