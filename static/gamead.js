var _wiw = window.innerWidth;
var _wih = window.innerHeight;

var _am;
var _al;
var _adc;
var _iti;
var _vct;
var _ca_pub;

function init(cp) {
    _ca_pub = cp;
    _vct = document.getElementById('contentElement');
    setUpIMA();
}

function setUpIMA() {
    // Create the ad display container.
    createAdDisplayContainer();
    // Create ads loader.
    _al = new google.ima.AdsLoader(_adc);
    _al.getSettings().setDisableCustomPlaybackForIOS10Plus(true);
    // Listen and respond to ads loaded and error events.
    _al.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        onAdsManagerLoaded,
        false);
    _al.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError,
        false);

    // An event listener to tell the SDK that our content video
    // is completed so the SDK can play any post-roll ads.
    var contentEndedListener = function () { _al.contentComplete(); };
    _vct.onended = contentEndedListener;

    // Request video ads.
    var _arq = new google.ima.AdsRequest();
    _arq.adTagUrl = 'https://googleads.g.doubleclick.net/pagead/ads?ad_type=video_image&client='+_ca_pub+'&description_url=' + encodeURIComponent(location.href) + '&videoad_start_delay=0&hl=en';

    // Specify the linear and nonlinear slot sizes. This helps the SDK to
    // select the correct creative if multiple are returned.
    _arq.linearAdSlotWidth = _wiw;
    _arq.linearAdSlotHeight = _wih;

    _arq.nonLinearAdSlotWidth = _wiw;
    _arq.nonLinearAdSlotHeight = _wih;

    _al.requestAds(_arq);
}


function createAdDisplayContainer() {
    _adc = new google.ima.AdDisplayContainer(
        document.getElementById('adContainer'), _vct);
}

function playAds() {
    _vct.load();
    _adc.initialize();

    try {
        _am.init(_wiw, _wih, google.ima.ViewMode.NORMAL);
        _am.start();
    } catch (adError) {
        _vct.play();
    }
}

function onAdsManagerLoaded(adsManagerLoadedEvent) {
    // Get the ads manager.
    var adsRenderingSettings = new google.ima.AdsRenderingSettings();
    adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
    // _vct should be set to the content video element.
    _am = adsManagerLoadedEvent.getAdsManager(
        _vct, adsRenderingSettings);

    // Add listeners to the required events.
    _am.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError);
    _am.addEventListener(
        google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
        onContentPauseRequested);
    _am.addEventListener(
        google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
        onContentResumeRequested);
    _am.addEventListener(
        google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
        onAdEvent);

    // Listen to any additional events, if necessary.
    _am.addEventListener(
        google.ima.AdEvent.Type.LOADED,
        onAdEvent);
    _am.addEventListener(
        google.ima.AdEvent.Type.STARTED,
        onAdEvent);
    _am.addEventListener(
        google.ima.AdEvent.Type.COMPLETE,
        onAdEvent);
    _am.addEventListener(
        google.ima.AdEvent.Type.SKIPPED,
        onAdEvent);
    _am.addEventListener(
        google.ima.AdEvent.Type.USER_CLOSE,
        onAdEvent);

      playAds();
}

function onAdEvent(adEvent) {
    var ad = adEvent.getAd();
    switch (adEvent.type) {
        case google.ima.AdEvent.Type.LOADED:
            if (!ad.isLinear()) {
                _vct.play();
            }
            break;
        case google.ima.AdEvent.Type.STARTED:
            if (ad.isLinear()) {
                _iti = setInterval(
                    function () {
                        var remainingTime = _am.getRemainingTime();
                    },
                    300); // every 300ms
            }
            break;
        case google.ima.AdEvent.Type.COMPLETE:
            if (ad.isLinear()) {
                clearInterval(_iti);
            }
            document.getElementById('mainContainer').style.display = 'none';
            break;
        case google.ima.AdEvent.Type.SKIPPED:
        case google.ima.AdEvent.Type.USER_CLOSE:
            document.getElementById('mainContainer').style.display = 'none';
            break;
    }
}

function onAdError(adErrorEvent) {
    _am && _am.destroy();
}

function onContentPauseRequested() {
    _vct.pause();
}

function onContentResumeRequested() {
    _vct.play();
}