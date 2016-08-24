import Log from './log';
const log = Log('task');
import cron from './cron';
import v2ex from './v2ex.sign';
import EmailSender from 'email-sender';
import conf from './config';

const sender = new EmailSender(conf.email);

// 发送通知邮件
function sendEmail(result) {
	const opt = result.error ? {
		subject: '你的V2EX签到任务失败了',
		html: `
		<html>
			<body>
				<p>任务失败\n\n${result.msg}</p>
				<a href="${conf.url}/v2ex">再次签到</a>
			</body>
		</html>
		`
	} : {
		subject: '你的V2EX签到任务已经完成',
		html: `
		<html>
			<body>
				<p>你已经连续签到${result.day}天，任务成功！</p>
				<a href="${conf.url}/v2ex">再次签到</a>
			</body>
		</html>
		`
	};
	return sender.send(Object.assign({
		to: conf.noticeEmail // list of receivers
	}, opt));
}

function runTask() {
	log.info('开始所有任务...');
	return v2ex.begin(conf.v2ex.user, conf.v2ex.pass).then((day) => {
		log.info('所有任务执行完毕!');
		// 发送通知邮件
		return sendEmail({
			error: false,
			day: day
		});
	}).catch(err => {
		log.error(err);
		return sendEmail({
			error: true,
			msg: err
		});
	}).then(() => {
		log.info('通知邮件已经发出!');
	}).catch(() => {
		log.info('通知邮件发送失败!');
	});
}

// 每天定时任务
cron.everyDayOnce(() => {
	runTask();
}).catch(err => log.error('定时任务错误:%o!', err));

module.exports = runTask;
