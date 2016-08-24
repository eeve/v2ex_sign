"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function sendEmail(e){var t=e.error?{subject:"你的V2EX签到任务失败了",html:"\n\t\t<html>\n\t\t\t<body>\n\t\t\t\t<p>任务失败\n\n"+e.msg+'</p>\n\t\t\t\t<a href="'+_config2.default.url+'/v2ex">再次签到</a>\n\t\t\t</body>\n\t\t</html>\n\t\t'}:{subject:"你的V2EX签到任务已经完成",html:"\n\t\t<html>\n\t\t\t<body>\n\t\t\t\t<p>你已经连续签到"+e.day+'天，任务成功！</p>\n\t\t\t\t<a href="'+_config2.default.url+'/v2ex">再次签到</a>\n\t\t\t</body>\n\t\t</html>\n\t\t'};return sender.send(Object.assign({to:_config2.default.noticeEmail},t))}function runTask(){return log.info("开始所有任务..."),_v2ex2.default.begin(_config2.default.v2ex.user,_config2.default.v2ex.pass).then(function(e){return log.info("所有任务执行完毕!"),sendEmail({error:!1,day:e})}).catch(function(e){return log.error(e),sendEmail({error:!0,msg:e})}).then(function(){log.info("通知邮件已经发出!")}).catch(function(){log.info("通知邮件发送失败!")})}var _log=require("./log"),_log2=_interopRequireDefault(_log),_cron=require("./cron"),_cron2=_interopRequireDefault(_cron),_v2ex=require("./v2ex.sign"),_v2ex2=_interopRequireDefault(_v2ex),_emailSender=require("email-sender"),_emailSender2=_interopRequireDefault(_emailSender),_config=require("./config"),_config2=_interopRequireDefault(_config),log=(0,_log2.default)("task"),sender=new _emailSender2.default(_config2.default.email);_cron2.default.everyDayOnce(function(){runTask()}).catch(function(e){return log.error("定时任务错误:%o!",e)}),module.exports=runTask;