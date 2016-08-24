import schedule from 'node-schedule';

module.exports = {
	// 每天7点和10点开始任务
	everyDayOnce: function(callback) {
		return new Promise((resolve, reject) => {
			try {
				const job = schedule.scheduleJob('0 0 7,10 * * *', function() {
					console.log('开始每日任务...');
					callback && callback();
				});
				resolve(job);
			} catch (e) {
				reject(e);
			}
		});
	}
}
