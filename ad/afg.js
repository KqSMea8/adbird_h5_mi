(function(){document.writeln("<div id=\'adContainer\' style=\'position: absolute;  top: 0;  left: 0;  right: 0;  bottom: 0;width:100%;height:100%;  margin: auto; z-index: -1;");document.writeln("\'>");document.writeln("    <video id=\'contentElement\' style=\'width: 0;height: 0;\'></video>");document.writeln("</div>");var adsManager;function getParameterByName(name,url){if(!url)url=window.location.href;name=name.replace(/[\[\]]/g,"\\$&");var regex=new RegExp("[?&]"+name+"(=([^&#]*)|&|#|$)"),results=regex.exec(url);if(!results)return null;if(!results[2])return null;return decodeURIComponent(results[2].replace(/\+/g," "));}
var client='ca-games-pub-6859459009162295'
if(client===null){client='ca-games-pub-6859459009162295';}
var url="https://googleads.g.doubleclick.net/pagead/ads?ad_type=image&client="+client+"&description_url="+encodeURIComponent(window.location.href)+"&videoad_start_delay=0&hl=en&max_ad_duration=30000";var videoContent=document.getElementById('contentElement');var adDisplayContainer=new google.ima.AdDisplayContainer(document.getElementById('adContainer'),videoContent);adDisplayContainer.initialize();var adsLoader=new google.ima.AdsLoader(adDisplayContainer);adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,onAdsManagerLoaded,false);adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR,onAdError,false);function onAdError(adErrorEvent){console.log(adErrorEvent.getError());adsManager.destroy();}
var adsRequest=new google.ima.AdsRequest();adsRequest.adTagUrl=url;adsRequest.linearAdSlotWidth=320;adsRequest.linearAdSlotHeight=320;adsRequest.nonLinearAdSlotWidth=320;adsRequest.nonLinearAdSlotHeight=320;var contentEndedListener=function(){adsLoader.contentComplete();};videoContent.onended=contentEndedListener;function onAdsManagerLoaded(adsManagerLoadedEvent){adsManager=adsManagerLoadedEvent.getAdsManager(videoContent);try{console.log(document.documentElement.clientWidth,document.documentElement.clientHeight)
adsManager.init(document.documentElement.clientWidth,document.documentElement.clientHeight,google.ima.ViewMode.NORMAL);adsManager.addEventListener(google.ima.AdEvent.Type.USER_CLOSE,onClose);adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE,onClose);adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR,onAdError);adsManager.start();}catch(adError){}}
function onClose(){document.getElementById('adContainer').style.zIndex=-1;}
var quick=function(){};quick.prototype={showAfg:function(){if(true)
{document.getElementById('adContainer').style.zIndex=99999999;adsLoader.requestAds(adsRequest);}}};window.QuickAds=new quick})();