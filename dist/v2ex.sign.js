"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,n){for(var r=0;r<n.length;r++){var t=n[r];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}return function(n,r,t){return r&&e(n.prototype,r),t&&e(n,t),n}}(),_utils=require("./utils"),_utils2=_interopRequireDefault(_utils),_log=require("./log"),_log2=_interopRequireDefault(_log),_cheerio=require("cheerio"),_cheerio2=_interopRequireDefault(_cheerio),log=(0,_log2.default)("v2ex"),V2exSign=function(){function e(n){_classCallCheck(this,e),this.urls={base:n},this.urls.login=this.urls.base+"/signin",this.urls.daily=this.urls.base+"/mission/daily"}return _createClass(e,[{key:"begin",value:function(e,n){var r=this;return e&&n?(log.debug("开始V2EX领取每日登录奖励任务..."),_utils2.default.GET(this.urls.base).then(function(e){return log.debug("获取登录表单页面..."),_utils2.default.GET(r.urls.login)}).then(function(r){log.debug("解析登录表单页面...");var t=_cheerio2.default.load(r),u=t(".sl");if(0===u.length)return Promise.reject(new Error("获取登录页面数据异常，数据为： "+r));var i=u.eq(0),l=u.eq(1),o=t('input[type="hidden"]'),a=o.eq(0),s=o.eq(1),c=a.val(),g=s.val(),f=i.attr("name"),d=l.attr("name"),h={};return h[f]=e,h[d]=n,h.once=c,h.next=g,h}).then(function(e){return log.debug("开始登录..."),log.debug("登录表单 %o",e),_utils2.default.POST(r.urls.login,e,{Referer:r.urls.login})}).then(function(e,n){return log.debug("检查是否登录成功..."),r._loginPass(e,n)}).then(function(){return log.debug("登录正常..."),log.debug("获取领取奖励页面..."),_utils2.default.GET(r.urls.daily)}).then(function(e){return log.debug("检查是否已经领取过..."),r._isSigined(e).then(function(n){return n===!0?(log.debug("你今天已经领取过登录奖励..."),log.info("你今天已经领取过登录奖励..."),r._signDays(e)):(log.debug("今天还没有领取奖励..."),log.debug("获取领取奖励链接..."),r._parseDailyUrl(e).then(function(e){return log.debug("开始领取奖励..."),_utils2.default.GET(e)}).then(function(e){return log.debug("每日登录奖励领取成功..."),log.info("每日登录奖励领取成功..."),r._signDays(e)}))})}).then(function(e){return log.debug("你已经连续登录了%d天!",e),log.info("你已经连续登录了%d天!",e),log.debug("领取登录奖励任务完成!"),log.info("领取登录奖励任务完成!"),e})):Promise.reject(new Error("请配置正确的V2EX用户名和密码"))}},{key:"_loginPass",value:function(e,n){var r=this;return new Promise(function(t,u){302===e&&void 0===n?_utils2.default.GET(r.urls.base).then(function(e){var n=_cheerio2.default.load(e),r=n(".top");r&&"登出"===r.last().text()?t():u(new Error("登录失败，页面状态不对"))}):u(new Error("登录失败，返回状态码和内容异常。code:"+e+", content:"+n))})}},{key:"_parseDailyUrl",value:function(e){var n=this;return new Promise(function(r,t){try{var u=_cheerio2.default.load(e),i=u(".super"),l=i.attr("onclick"),o=/'(.*)'/.exec(l),a=o[1];r(""+n.urls.base+a)}catch(e){t(new Error("获取签到链接失败"))}})}},{key:"_signDays",value:function(e){return new Promise(function(n,r){try{var t=_cheerio2.default.load(e),u=t("#Main .box .cell").last(),i=u.text();n(/\d+/.exec(i)[0])}catch(e){r(new Error("获取连续登录天数失败"))}})}},{key:"_isSigined",value:function(e){return new Promise(function(n,r){try{var t=_cheerio2.default.load(e),u=t(".super");n("查看我的账户余额"===u.val())}catch(e){r(new Error("获取连续登录天数失败"))}})}}]),e}();module.exports=new V2exSign("http://v2ex.com");