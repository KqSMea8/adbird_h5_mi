require=function l(a,i,r){function n(t,e){if(!i[t]){if(!a[t]){var o="function"==typeof require&&require;if(!e&&o)return o(t,!0);if(g)return g(t,!0);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}var s=i[t]={exports:{}};a[t][0].call(s.exports,function(e){return n(a[t][1][e]||e)},s,s.exports,l,a,i,r)}return i[t].exports}for(var g="function"==typeof require&&require,e=0;e<r.length;e++)n(r[e]);return n}({HelloWorld:[function(e,t,o){"use strict";cc._RF.push(t,"280c3rsZJJKnZ9RqbALVwtK","HelloWorld"),cc.Class({extends:cc.Component,properties:{ballspeed:0,main_Layout:cc.Node,game_Layout:cc.Node,gameover_Layout:cc.Node,sounds:[cc.AudioClip],bestscore_Label0:cc.Label,music1:cc.Toggle,homeBallImg:cc.Node,pause_Node:cc.Node,start_Mask:cc.Node,score_Label:cc.Label,userball:cc.Node,ball:[cc.Prefab],build:[cc.Node],music2:cc.Toggle,bestscore_Label2:cc.Label,score_Label2:cc.Label,heartbeat:cc.Node,bestscore_Label:cc.Label,score_Label1:cc.Label,gameoverBest_node:cc.Node,bestscore_Sprite:cc.Node,music3:cc.Toggle,gameOverBallImg:cc.Node,shareButton:cc.Node,resurgenceButton:cc.Node,countdownLabel:cc.Label,dialog:cc.Node,gameoverScore:cc.Label,gameoverHint:cc.Label,videoResurrect:cc.Node,videoGetGold:cc.Node,cover:cc.Node},onLoad:function(){cc.log("------onload-------"),this.bofang=!0,cc.director.getCollisionManager().enabled=!0,this.main_Layout.active=!0,this.game_Layout.active=!1,this.gameover_Layout.active=!1,this.coverAll(!1),this.bestscore=0,this.gameCount=0,this.sendGoldNum=100;var t=this;if(cc.log("看看self"+t),cc.sys.platform===cc.sys.WECHAT_GAME){if(wx.showShareMenu(),wx.updateShareMenu({withShareTicket:!1}),wx.onShareAppMessage(function(e){return{title:"这个游戏就是爽，爽爽爽爽爽！",imageUrl:"res/share.jpg",complete:function(e){"shareAppMessage:ok"==e.errMsg?t.getMoreGold(t.sendGoldNum):wx.showToast({title:"分享失败"})}}}),cc.log("微信小游戏useBall:"),this.useBall=wx.getStorageSync("useBall"),null==this.useBall.ball){cc.log("不存在useBall，存储useBall");var e={ball:"ball1",toggle:"toggle1"};wx.setStorageSync("useBall",e),this.useBall=wx.getStorageSync("useBall")}}else if(cc.log("其他平台useBall:"),this.useBall=JSON.parse(cc.sys.localStorage.getItem("useBall")),null==this.useBall){cc.log("没有正在使用的球球");e={ball:"ball1",toggle:"toggle1"};cc.sys.localStorage.setItem("useBall",JSON.stringify(e)),this.useBall=JSON.parse(cc.sys.localStorage.getItem("useBall"))}cc.log("当前使用的小球是："+this.useBall.ball);var o=cc.url.raw("resources/Texture/images/group"+this.useBall.ball+"/normal.png"),c=cc.textureCache.addImage(o);this.homeBallImg.getComponent(cc.Sprite).spriteFrame=new cc.SpriteFrame(c)},start:function(){var t=this;if(cc.sys.platform===cc.sys.WECHAT_GAME){var o=wx.getSystemInfoSync().screenHeight,e=wx.getSystemInfoSync().screenWidth;this.bannerAd=wx.createBannerAd({adUnitId:"adunit-bd5aad5d5c61ddc7",style:{left:0,top:0,width:e}}),this.bannerAdError(),this.bannerAd.show(),this.bannerAd.onResize(function(e){t.bannerAd.style.height=e.height,t.bannerAd.style.top=o-t.bannerAd.style.height}),this.rewardedVideoAd=wx.createRewardedVideoAd({adUnitId:"adunit-ffbf08053f5d1995"}),this.getGoldVideoAd=wx.createRewardedVideoAd({adUnitId:"adunit-adunit-b8339fe368e32e77"})}if(cc.sys.platform===cc.sys.WECHAT_GAME)var c=wx.getStorageSync("uScore");else c=JSON.parse(cc.sys.localStorage.getItem("uScore"));null!=c&&null!=c.score||(c={score:0}),this.bestscore_Label0.string=c.score},initgame:function(e){cc.log("初始化game场景"),this.heartbeat.active=!1;var t=cc.url.raw("resources/Texture/images/group"+this.useBall.ball+"/normal.png"),o=cc.textureCache.addImage(t);this.userball.children[0].getComponent(cc.Sprite).spriteFrame=new cc.SpriteFrame(o),cc.sys.platform===cc.sys.WECHAT_GAME&&this.bannerAd.hide(),this.startgame(null,!0),this.pausegame(null,!1),null==e?(this.score_Label.string="0",this.score=0):(this.score_Label.string=this.score,this.score=this.score);var c=cc.loader.getDependsRecursively("Prefabs/blueball"),s=cc.loader.getDependsRecursively("Prefabs/redball");cc.loader.release(c),cc.loader.release(s);for(var l=0;l<2;l++)this.build[l].removeAllChildren();this.buildnum=0},change:function(){180==this.userball.rotation?this.userball.runAction(cc.rotateTo(.16,360)):360!=this.userball.rotation&&0!=this.userball.rotation||this.userball.runAction(cc.rotateTo(.16,180))},startgame:function(e,t){null!=e&&(this.gameCount+=1),"true"==t?t=!0:"false"==t&&(t=!1),0==t&&this.gamestart(),this.start_Mask.active=t},gamestart:function(){this.buildball()},buildball:function(){cc.log("生成球，当前使用的球是什么"+this.useBall.ball);var e,t=.5<Math.random()?0:1;0==t&&(e="ball1.png"),1==t&&(e="ball2.png");var o=cc.url.raw("resources/Texture/images/group"+this.useBall.ball+"/"+e),c=cc.textureCache.addImage(o);this.ball[t].data.getComponent(cc.Sprite).spriteFrame=new cc.SpriteFrame(c),cc.log("0的节点名称是什么"+this.ball[t].data.name),this.sball=cc.instantiate(this.ball[t]),cc.log("名称是什么"+this.ball[t].data.name),this.sball.parent=this.build[this.buildnum],this.sball.position=cc.p(0,0),this.action=null,0==this.buildnum?(this.action=cc.repeatForever(cc.moveBy(.11,cc.p(0,46))),this.sball.runAction(cc.rotateTo(.16,180))):this.action=cc.repeatForever(cc.moveBy(.11,cc.p(0,-46))),this.sball.runAction(this.action),0==this.buildnum?this.buildnum=1:1==this.buildnum&&(this.buildnum=0),this.audioplay(3)},setscore:function(){this.score+=1,this.score_Label.string=this.score,this.getMoreGold(1)},pausegame:function(e,t){if(cc.log("暂停游戏"),"true"==t?(t=!0,null!=this.sball&&null!=this.action&&(cc.sys.platform===cc.sys.WECHAT_GAME&&this.bannerAd.hide(),this.sball.stopAction(this.action),this.sball.active=!1)):"false"==t&&(t=!1,null!=this.sball&&null!=this.action&&(cc.sys.platform===cc.sys.WECHAT_GAME&&this.bannerAd.hide(),this.sball.active=!0,this.sball.runAction(this.action))),this.audioplay(1),this.pause_Node.active=t,1==this.bofang?this.music2.isChecked=!0:0==this.bofang&&(this.music2.isChecked=!1),cc.sys.platform===cc.sys.WECHAT_GAME)var o=wx.getStorageSync("uScore");else o=JSON.parse(cc.sys.localStorage.getItem("uScore"));null!=o&&null!=o.score||(o={score:0}),this.bestscore_Label2.string=o.score,this.score_Label2.string=this.score_Label.string},initgameover:function(){cc.log("初始化gameover场景");var e=cc.url.raw("resources/Texture/images/group"+this.useBall.ball+"/failure.png"),t=cc.textureCache.addImage(e);this.gameOverBallImg.getComponent(cc.Sprite).spriteFrame=new cc.SpriteFrame(t),this.bestscore_Sprite.active=!1,this.score_Label1.string=0,cc.sys.platform===cc.sys.WECHAT_GAME&&(this.bannerAdError(),this.bannerAd.show())},setbestscore:function(){var e;if(cc.log("设置最佳～～～"),cc.sys.platform===cc.sys.WECHAT_GAME){if(null==(e=wx.getStorageSync("uScore")).score){var t={score:0};wx.setStorageSync("uScore",t),e=wx.getStorageSync("uScore")}}else if(null==(e=JSON.parse(cc.sys.localStorage.getItem("uScore")))){t={score:0};cc.sys.localStorage.setItem("uScore",JSON.stringify(t)),e=JSON.parse(cc.sys.localStorage.getItem("uScore"))}if(this.bestscore_Label.string=e.score,e.score<this.score){this.gameoverBest_node.opacity=0,this.bestscore_Sprite.active=!0,this.bestscore_Label.string=this.score;t={score:this.score};if(cc.sys.platform===cc.sys.WECHAT_GAME){wx.setStorageSync("uScore",t);var o=this.score;o=String(o),this.setWeixinManagedData("score",o)}else cc.sys.localStorage.setItem("uScore",JSON.stringify(t))}else this.gameoverBest_node.opacity=255;this.score_Label1.string=this.score},Tomainlayout:function(){cc.log("跳转到主场景"),this.audioplay(1),this.main_Layout.active=!0,this.game_Layout.active=!1,this.gameover_Layout.active=!1,this.coverAll(!1),1==this.bofang?this.music1.isChecked=!0:0==this.bofang&&(this.music1.isChecked=!1)},Togamelayout:function(){cc.log("跳转到游戏场景"),this.gameCount=0,this.audioplay(1),this.main_Layout.active=!1,this.game_Layout.active=!0,this.gameover_Layout.active=!1,this.coverAll(!1),this.initgame()},Togameoverlayout:function(){cc.log("跳转到游戏结束场景"),this.audioplay(1),this.main_Layout.active=!1,this.game_Layout.active=!1,this.gameover_Layout.active=!0,this.coverAll(!1),this.gameoverScore.string=this.score,this.initgameover(),1==this.bofang?this.music3.isChecked=!0:0==this.bofang&&(this.music3.isChecked=!1),cc.sys.platform!=cc.sys.WECHAT_GAME&&this.playRewordAd(0),1==this.gameCount&&(this.videoResurrect.active=!0,this.videoGetGold.active=!1,this.gameoverHint.string="观看视频可以复活哦！",cc.sys.platform!=cc.sys.WECHAT_GAME&&this.continueGame()),1<this.gameCount&&(this.videoResurrect.active=!1,this.videoGetGold.active=!0,this.gameoverHint.string="观看视频可以获得双倍金币哦！")},setVolume:function(){0==this.bofang?(this.bofang=!0,this.audioplay(0)):1==this.bofang&&(this.audioplay(0),this.bofang=!1)},audioplay:function(e){var t=100;null!=e&&(1==e&&(t=0),2==e&&(t=1),3==e&&(t=2),4==e&&(t=3),t<4&&this.playsound(this.sounds[t])),null==e&&cc.audioEngine.stopAllEffects(this.current)},playsound:function(e){null!=e&&1==this.bofang&&(this.current=cc.audioEngine.play(e,!1,1))},toShop:function(){cc.log("去商城！！！！！"),cc.sys.platform===cc.sys.WECHAT_GAME&&this.bannerAd.hide(),cc.director.loadScene("shop")},changetTexture:function(e){cc.log("播放动画");var t=this.userball.children[0].getComponent(cc.Animation);1==e&&(this.bubbles(),t.playAdditive(this.useBall.ball+"KissAnimationClip")),2==e&&(this.bubbles(),t.playAdditive(this.useBall.ball+"ControlAnimationClip"))},bubbles:function(){cc.log("播放冒心动画"),this.heartbeat.active=!0,this.heartbeat.getComponent(cc.Animation).playAdditive()},share:function(e,t,o,c){cc.log("分享游戏送金币");var s=this;cc.sys.platform===cc.sys.WECHAT_GAME&&wx.shareAppMessage({title:e,imageUrl:"res/share.jpg",complete:function(e){"shareAppMessage:ok"==e.errMsg?(null!=t&&s.getMoreGold(t),o&&s.continueGame(),"hide"==c&&(s.shareButton.active=!1)):wx.showToast({title:"分享失败"})}})},mainShare:function(e){if(cc.log("主页转发按钮"),cc.sys.platform===cc.sys.WECHAT_GAME){this.share("来来来，玩完了这局再来三局！",this.sendGoldNum,!1)}},resurgence:function(e,t){if(cc.log("让我复活啊"+t),cc.sys.platform===cc.sys.WECHAT_GAME){if(cc.log("微信小游戏平台"),1==t){cc.log("微信小游戏分享");this.share("就问你敢不敢来跟我PK！",null,!0)}2==t&&(console.log("点击视频复活按钮"),this.rewardedVideoAd?this.coverAll(!0):this.coverAll(!1),this.dilogClose(),this.playRewordAd(1))}else this.playRewordAd(1),this.continueGame()},continueGame:function(){cc.log("复活成功，继续游戏"),this.audioplay(1),this.main_Layout.active=!1,this.game_Layout.active=!0,this.gameover_Layout.active=!1,this.coverAll(!1),this.dialog.active=!1,this.initgame(1)},getMoreGold:function(e){if(console.log("加金币啦！"+e),cc.sys.platform===cc.sys.WECHAT_GAME){if(null==(c=wx.getStorageSync("userTotalScore")).totalScore){var t={totalScore:0};wx.setStorageSync("userTotalScore",t),c=wx.getStorageSync("userTotalScore")}var o={totalScore:Number(c.totalScore)+e};wx.setStorageSync("userTotalScore",o)}else{var c;if(null==(c=JSON.parse(cc.sys.localStorage.getItem("userTotalScore")))){t={totalScore:0};cc.sys.localStorage.setItem("userTotalScore",JSON.stringify(t)),c=JSON.parse(cc.sys.localStorage.getItem("userTotalScore"))}o={totalScore:c.totalScore+e};cc.sys.localStorage.setItem("userTotalScore",JSON.stringify(o))}},shareGetGold:function(){cc.log("分享成功，奖励金币");var e="我得了"+this.score+"分，想要问问你敢不敢像我这样得高分！";this.share(e,this.score,!1,"hide")},gameOverShare:function(){if(cc.log("分享最高分"),cc.sys.platform===cc.sys.WECHAT_GAME){var e="我得了"+this.score+"分，想要问问你敢不敢像我这样得高分！";this.share(e,this.score,!1)}},rankList:function(){cc.log("排行榜。。。"),this.coverAll(!1),cc.sys.platform===cc.sys.WECHAT_GAME&&this.bannerAd.hide(),cc.director.loadScene("RankingView")},setWeixinManagedData:function(e,t){wx.setUserCloudStorage({KVDataList:[{key:e,value:t}],success:function(e){console.log("setUserCloudStorage","success",e);wx.getOpenDataContext()},fail:function(e){console.log("setUserCloudStorage","fail")},complete:function(e){console.log("setUserCloudStorage","ok")}})},toWxGameHub:function(){cc.log("进入微信游戏圈。。。。")},dilogClose:function(){cc.log("关闭对话框"),this.dialog.active=!1},coverAll:function(e){this.cover.active=e},watchetGold:function(){console.log("看视频送金币"),this.getGoldVideoAd?this.coverAll(!0):this.coverAll(!1),this.dilogClose(),this.playRewordAd(2)},playRewordAd:function(e){var t=this;cc.sys.platform===cc.sys.WECHAT_GAME?(1==e&&((this.rewardedVideoAd.bind_this=this).rewardedVideoAd.onClose(this.rewardedVideoAd.bind_this.adSuccessPlay),this.rewardedVideoAd.onError(this.rewardedVideoAd.bind_this.adErrorPlay),console.log("复活-播放视频"),this.rewardedVideoAd.load().then(function(){return t.rewardedVideoAd.show().catch(function(e){return console.log(e)})})),2==e&&((this.getGoldVideoAd.bind_this=this).getGoldVideoAd.onClose(this.getGoldVideoAd.bind_this.ad2SuccessPlay),this.getGoldVideoAd.onError(this.getGoldVideoAd.bind_this.ad2ErrorPlay),console.log("双倍金币-播放视频"),this.getGoldVideoAd.load().then(function(){return t.getGoldVideoAd.show().catch(function(e){return console.log(e)})}))):(console.log("其他平台播放广告"),QuickAds.showAfg())},adSuccessPlay:function(e){var t=cc.find("Canvas").getComponent("HelloWorld");e&&e.isEnded||void 0===e?(console.log("正常播放完成"),t.afterLookVideo(0)):(console.log("播放中途退出"),t.afterLookVideo(1)),t.rewardedVideoAd&&t.rewardedVideoAd.bind_this&&(console.log("释放激励广告视频"),t.rewardedVideoAd.offClose(t.rewardedVideoAd.bind_this.adSuccessPlay))},ad2SuccessPlay:function(e){var t=cc.find("Canvas").getComponent("HelloWorld");e&&e.isEnded||void 0===e?(console.log("正常播放完成"),t.afterLookVideo2(0)):(console.log("播放中途退出"),t.afterLookVideo2(1)),t.getGoldVideoAd&&t.getGoldVideoAd.bind_this&&(console.log("释放激励广告视频2"),t.getGoldVideoAd.offClose(t.getGoldVideoAd.bind_this.ad2SuccessPlay))},afterLookVideo:function(e){this.coverAll(!1),0==e&&(console.log("看完完整视频-复活成功-游戏界面"),this.continueGame()),1==e&&console.log("没看完完整视频-复活失败-gameover界面")},afterLookVideo2:function(e){console.log("看完视频应加"+this.score+"分！"),this.coverAll(!1),0==e&&(console.log("看完完整视频-奖励金币"),this.getMoreGold(this.score)),1==e&&console.log("没看完完整视频-不做操作")},adErrorPlay:function(e){console.log("激励视频1错误"+e.errCode);var t=cc.find("Canvas").getComponent("HelloWorld");e&&0<=e.errCode&&(t.coverAll(!1),wx.showToast({icon:"none",title:"很遗憾，没有视频了"})),t.rewardedVideoAd.offError(t.rewardedVideoAd.bind_this.adErrorPlay)},ad2ErrorPlay:function(e){console.log("激励视频2错误"+e.errCode);var t=cc.find("Canvas").getComponent("HelloWorld");e&&0<=e.errCode&&(t.coverAll(!1),wx.showToast({icon:"none",title:"很遗憾，没有视频了"})),t.getGoldVideoAd.offError(t.getGoldVideoAd.bind_this.ad2ErrorPlay)},toOtherGame:function(){console.log("跳转到新海盗来了"),cc.sys.platform===cc.sys.WECHAT_GAME&&wx.navigateToMiniProgram({appId:"wxbb1a2b97f3131078",path:"",extraData:{foo:"bar"},envVersion:"release",success:function(e){console.log("打开新海盗来了成功")}})},bannerAdError:function(){this.bannerAd.onError(function(e){1004==e.errCode&&console.log("无合适的广告"),1005==e.errCode&&console.log("广告组件审核中"),1006==e.errCode&&console.log("广告组件被驳回")})}}),cc._RF.pop()},{}],RankingView:[function(e,t,o){"use strict";cc._RF.push(t,"ed81eRMoXVHSY0+WVmALWHp","RankingView"),cc.Class({extends:cc.Component,name:"RankingView",properties:{groupFriendButton:cc.Node,friendButton:cc.Node,gameOverButton:cc.Node,rankingScrollView:cc.Sprite,rankTitle:cc.Node},onLoad:function(){},start:function(){0},friendButtonFunc:function(e){this.rankTitle.getComponent(cc.Label).string="好友排行",cc.log("获取好友排行榜数据。x1")},groupFriendButtonFunc:function(e){this.rankTitle.getComponent(cc.Label).string="好友排行"},goHome:function(){cc.director.loadScene("main")},shareGame:function(){cc.log("分享游戏"),cc.sys.platform===cc.sys.WECHAT_GAME&&wx.shareAppMessage({title:"敢不敢跟我比一比？",imageUrl:"res/share.jpg",complete:function(e){"shareAppMessage:ok"==e.errMsg?cc.log("--分享成功--"):wx.showToast({title:"分享失败"})}})},_updateSubDomainCanvas:function(){null!=window.sharedCanvas&&(this.tex.initWithElement(window.sharedCanvas),this.tex.handleLoadedTexture(),this.rankingScrollView.spriteFrame=new cc.SpriteFrame(this.tex))},update:function(){this._updateSubDomainCanvas()}}),cc._RF.pop()},{}],ball:[function(e,t,o){"use strict";cc._RF.push(t,"87153JJBqtNT4FvxpoPA5Bs","ball"),cc.Class({extends:cc.Component,properties:{},onCollisionEnter:function(e,t){cc.log("碰撞产生");var o=cc.find("Canvas").getComponent("HelloWorld");o.changetTexture(t.tag),e.tag==t.tag?(o.buildball(),o.setscore(),o.audioplay(4)):(o.Togameoverlayout(),o.setbestscore(),o.audioplay(2)),this.node.destroy()}}),cc._RF.pop()},{}],loading:[function(e,t,o){"use strict";cc._RF.push(t,"e6ff126KXFD3qNXi3n2EEYp","loading"),cc.Class({extends:cc.Component,properties:{},start:function(){cc.sys.platform===cc.sys.WECHAT_GAME&&(cc.log("微信小游戏用户授权"),wx.authorize({scope:"scope.record",fail:function(e){(-1<e.errMsg.indexOf("auth deny")||-1<e.errMsg.indexOf("auth denied"))&&cc.log("用户拒绝授权")}})),this.loadscene()},loadscene:function(){cc.loader.loadResDir("/",function(e,t,o){},function(e,t,o){cc.log("加载资源数量"+t.length),e||cc.director.loadScene("main")})}}),cc._RF.pop()},{}],shop:[function(e,t,o){"use strict";cc._RF.push(t,"54dddkeiqVM16u2AeArkNcV","shop"),cc.Class({extends:cc.Component,properties:{gold:cc.Label,payLabel:cc.Label,buy:cc.Node,toggleGroup:cc.Node,background:cc.Node},onLoad:function(){if(this.goodsPrice=5e3,this.buy.getComponent(cc.Button).interactable=!1,this.buy.getChildByName("Label").color=new cc.color(172,165,165,255),cc.sys.platform===cc.sys.WECHAT_GAME){var e=wx.getStorageSync("userTotalScore"),t=wx.getStorageSync("useBall");if(null==(c=wx.getStorageSync("ballNum")).ballNum){cc.log("************"),wx.setStorageSync("ball1",2),wx.setStorageSync("ball2",0),wx.setStorageSync("ball3",0),wx.setStorageSync("ball4",0),wx.setStorageSync("ball5",0),wx.setStorageSync("ball6",0),wx.setStorageSync("ball7",0),wx.setStorageSync("ball8",0),wx.setStorageSync("ball9",0),wx.setStorageSync("ball10",0),wx.setStorageSync("ball11",0);wx.setStorageSync("ballNum",{ballNum:1})}}else{e=JSON.parse(cc.sys.localStorage.getItem("userTotalScore")),t=JSON.parse(cc.sys.localStorage.getItem("useBall"));null==cc.sys.localStorage.getItem("ball1")&&cc.sys.localStorage.setItem("ball1",2),null==cc.sys.localStorage.getItem("ball2")&&cc.sys.localStorage.setItem("ball2",0),null==cc.sys.localStorage.getItem("ball3")&&cc.sys.localStorage.setItem("ball3",0),null==cc.sys.localStorage.getItem("ball4")&&cc.sys.localStorage.setItem("ball4",0),null==cc.sys.localStorage.getItem("ball5")&&cc.sys.localStorage.setItem("ball5",0),null==cc.sys.localStorage.getItem("ball6")&&cc.sys.localStorage.setItem("ball6",0),null==cc.sys.localStorage.getItem("ball7")&&cc.sys.localStorage.setItem("ball7",0),null==cc.sys.localStorage.getItem("ball8")&&cc.sys.localStorage.setItem("ball8",0),null==cc.sys.localStorage.getItem("ball9")&&cc.sys.localStorage.setItem("ball9",0),null==cc.sys.localStorage.getItem("ball10")&&cc.sys.localStorage.setItem("ball10",0),null==cc.sys.localStorage.getItem("ball11")&&cc.sys.localStorage.setItem("ball11",0)}null==e||null==e.totalScore?(this.gold.string=0,this.userGold=0):(this.gold.string=e.totalScore,this.userGold=e.totalScore),null!=t&&null!=t.ball||(cc.log("没有正在使用的球球"),t={ball:"ball1",toggle:"toggle1"},cc.sys.platform===cc.sys.WECHAT_GAME?wx.setStorageSync("useBall",t):cc.sys.localStorage.setItem("useBall",JSON.stringify(t))),cc.log("正在使用中的球球是"+t.toggle),this.toggleGroup.getChildByName("toggle1").getChildByName("checkmark").active=!1;for(var o=1;o<=this.toggleGroup.children.length;o++){if(cc.sys.platform===cc.sys.WECHAT_GAME)var c=wx.getStorageSync("ball"+o);else c=cc.sys.localStorage.getItem("ball"+o);0==c&&(cc.log("显示价格"),this.toggleGroup.getChildByName("toggle"+o).getChildByName("New Label").getComponent(cc.Label).string=this.goodsPrice),1==c&&(cc.log("显示已拥有"),this.toggleGroup.getChildByName("toggle"+o).getChildByName("New Label").getComponent(cc.Label).string="已拥有"),2==c&&(cc.log("显示使用中"),this.toggleGroup.getChildByName("toggle"+o).getChildByName("New Label").getComponent(cc.Label).string="使用中")}},toHome:function(){cc.log("回到主页！！！！！"),cc.director.loadScene("main")},selectBall:function(e,t){if(cc.log("选中球event=",e.target,"选中球data=",t),this.clickBall=t,this.clickBallNode=e.target,cc.sys.platform===cc.sys.WECHAT_GAME)var o=wx.getStorageSync(t),c=wx.getStorageSync("useBall");else o=JSON.parse(cc.sys.localStorage.getItem(t)),c=JSON.parse(cc.sys.localStorage.getItem("useBall"));cc.log("选中的ball是什么---"+o),cc.log("使用中的球："+c.ball);var s=e.target;(cc.find("Background",s).getComponent(cc.Animation).play(),2==o&&(cc.log("正在使用中的球球"),this.buy.getComponent(cc.Button).interactable=!1,this.buy.getChildByName("Label").color=new cc.color(172,165,165,255),this.payLabel.string=""),1==o)&&(cc.log("已经拥有的的球球"),this.buy.getComponent(cc.Button).interactable=!1,this.buy.getChildByName("Label").color=new cc.color(172,165,165,255),this.payLabel.string="",cc.log("使用球"+c.ball),cc.log("选择的球球"+t),cc.sys.platform===cc.sys.WECHAT_GAME?(wx.setStorageSync(c.ball,1),wx.setStorageSync(t,2),c=wx.getStorageSync("useBall")):(cc.sys.localStorage.setItem(c.ball,1),cc.sys.localStorage.setItem(t,2),c=JSON.parse(cc.sys.localStorage.getItem("useBall"))),cc.log("正在使用！！！！！"+c.ball),cc.log("选择的球球"+t),this.toggleGroup.getChildByName(c.toggle).getChildByName("New Label").getComponent(cc.Label).string="已拥有",cc.find("New Label",s).getComponent(cc.Label).string="使用中",c={ball:t,toggle:s.name},cc.sys.platform===cc.sys.WECHAT_GAME?(wx.setStorageSync("useBall",c),c=wx.getStorageSync("useBall")):(cc.sys.localStorage.setItem("useBall",JSON.stringify(c)),c=JSON.parse(cc.sys.localStorage.getItem("useBall"))),cc.log("当前正在使用中的球："+c.ball+"所在的toggle："+c.toggle));0==o&&(cc.log("用户金币："+this.userGold),this.userGold<this.goodsPrice?(this.buy.getComponent(cc.Button).interactable=!1,this.buy.getChildByName("Label").color=new cc.color(172,165,165,255),this.payLabel.string="金币不足"):(this.buy.getComponent(cc.Button).interactable=!0,this.payLabel.string="-"+this.goodsPrice,this.buy.getChildByName("Label").color=new cc.color(253,151,66,255))),this.useBallName=c.ball,this.useBalltoggle=c.toggle},buyBall:function(e,t){if(cc.log("点击购买按钮，购买球球"),cc.log("当前选择的球是:"+this.clickBall),cc.sys.platform===cc.sys.WECHAT_GAME)var o=wx.getStorageSync(this.clickBall);else o=JSON.parse(cc.sys.localStorage.getItem(this.clickBall));if(0==o&&this.userGold>=this.goodsPrice){this.userGold=this.userGold-this.goodsPrice;var c={totalScore:this.userGold};this.gold.string=this.userGold,cc.sys.platform===cc.sys.WECHAT_GAME?(wx.setStorageSync("userTotalScore",c),wx.setStorageSync(this.useBallName,1),wx.setStorageSync(this.clickBall,2)):(cc.sys.localStorage.setItem("userTotalScore",JSON.stringify(c)),cc.sys.localStorage.setItem(this.useBallName,1),cc.sys.localStorage.setItem(this.clickBall,2)),this.toggleGroup.getChildByName(this.useBalltoggle).getChildByName("New Label").getComponent(cc.Label).string="已拥有",cc.find("New Label",this.clickBallNode).getComponent(cc.Label).string="使用中";var s={ball:this.clickBall,toggle:this.clickBallNode.name};cc.sys.platform===cc.sys.WECHAT_GAME?(wx.setStorageSync("useBall",s),s=wx.getStorageSync("useBall")):(cc.sys.localStorage.setItem("useBall",JSON.stringify(s)),s=JSON.parse(cc.sys.localStorage.getItem("useBall"))),this.useBallName=s.ball,this.useBalltoggle=s.toggle,this.buy.getComponent(cc.Button).interactable=!1,this.buy.getChildByName("Label").color=new cc.color(172,165,165,255),this.payLabel.string="购买成功"}}}),cc._RF.pop()},{}]},{},["HelloWorld","RankingView","ball","loading","shop"]);