import Utils from './utils';
import Log from './log';
import cheerio from 'cheerio';
const log = Log('v2ex');

class V2exSign {

	/**
	 * 构造函数
	 * @param url V2ex的主域名
	 */
	constructor(url) {
		this.urls = {
			base: url
		};
		this.urls.login = `${this.urls.base}/signin`;
		this.urls.daily = `${this.urls.base}/mission/daily`;
	}

	/**
	 * 开始领取每日奖励任务
	 * @returns {Promise.<TResult>}
	 */
	begin(user_account, user_pwd) {
		if (!user_account || !user_pwd) {
			return Promise.reject(new Error('请配置正确的V2EX用户名和密码'));
		}
		log.debug('开始V2EX领取每日登录奖励任务...');
		return Utils.GET(this.urls.base).then(text => {
			log.debug('获取登录表单页面...');
			return Utils.GET(this.urls.login);
		}).then(text => {
			log.debug('解析登录表单页面...');
			// 解析页面
			const $ = cheerio.load(text);

			// 用户名,密码框
			const inputs = $('.sl');
			if (inputs.length === 0) {
				return Promise.reject(new Error(`获取登录页面数据异常，数据为： ${text}`));
			}
			const accountInput = inputs.eq(0);
			const pwdInput = inputs.eq(1);

			// 隐藏域
			const hiddens = $('input[type="hidden"]');
			const codeInput = hiddens.eq(0);
			const nextInput = hiddens.eq(1);

			// 值
			const code = codeInput.val();
			const next = nextInput.val();

			// key
			const account = accountInput.attr('name');
			const pwd = pwdInput.attr('name');

			// 构造登录表单对象
			var loginForm = {};
			loginForm[account] = user_account;
			loginForm[pwd] = user_pwd;
			loginForm['once'] = code;
			loginForm['next'] = next;

			return loginForm;
		}).then(form => {
			log.debug('开始登录...');
			log.debug('登录表单 %o', form);
			return Utils.POST(this.urls.login, form, {
				'Referer': this.urls.login
			});
		}).then((status, text) => {
			log.debug('检查是否登录成功...');
			return this._loginPass(status, text);
		}).then(() => {
			log.debug('登录正常...');
			log.debug('获取领取奖励页面...');
			return Utils.GET(this.urls.daily);
		}).then(text => {
			log.debug('检查是否已经领取过...');
			// 是否已经领取奖励
			return this._isSigined(text).then(done => {
				// 已经领取过
				if (done === true) {
					log.debug('你今天已经领取过登录奖励...');
					log.info('你今天已经领取过登录奖励...');
					// 获取连续登录日
					return this._signDays(text);
				} else {
					log.debug('今天还没有领取奖励...');
					log.debug('获取领取奖励链接...');
					return this._parseDailyUrl(text).then(url => {
						// 领取奖励
						log.debug('开始领取奖励...');
						return Utils.GET(url);
					}).then(text => {
						log.debug('每日登录奖励领取成功...');
						log.info('每日登录奖励领取成功...');
						// 获取连续登录日
						return this._signDays(text);
					});
				}
			});
		}).then((days) => {
			log.debug('你已经连续登录了%d天!', days);
			log.info('你已经连续登录了%d天!', days);
			log.debug('领取登录奖励任务完成!');
			log.info('领取登录奖励任务完成!');
			return days;
		});
	}

	/**
	 * 判断是否登录成功
	 * @param status 请求登录API后的HTTP状态码
	 * @param text	请求登录API的响应内容
	 * @returns {object} Promise
	 */
	_loginPass(status, text) {
		return new Promise((resolve, reject) => {
			if (status === 302 && text === undefined) {
				Utils.GET(this.urls.base).then(text => {
					// 解析页面
					const $ = cheerio.load(text);
					// 确认页面是否存在"登出"按钮
					const tops = $('.top');
					if (tops && tops.last().text() === '登出') {
						resolve();
					} else {
						reject(new Error('登录失败，页面状态不对'));
					}
				});
			} else {
				reject(new Error(`登录失败，返回状态码和内容异常。code:${status}, content:${text}`));
			}
		});
	}

	/**
	 * 签到页面HTML解析出真正的签到URL
	 * @param text 签到页面HTML
	 * @returns {Promise}
	 */
	_parseDailyUrl(text) {
		return new Promise((resolve, reject) => {
			try {
				// 解析页面
				const $ = cheerio.load(text);
				// 获取"签到按钮"
				const btn = $('.super');
				// 获取按钮上的onclick属性值
				const rawUrl = btn.attr('onclick');
				// 匹配出真正的签到URL
				const regx = /'(.*)'/.exec(rawUrl);
				const url = regx[1];
				// 与主域名拼合
				resolve(`${this.urls.base}${url}`);
			} catch (e) {
				reject(new Error('获取签到链接失败'));
			}
		});
	}

	/**
	 * 获取连续登录天数
	 * @param text v2exDaily页面的HTML
	 * @returns {Promise}
	 */
	_signDays(text) {
		return new Promise((resolve, reject) => {
			try {
				// 解析页面
				const $ = cheerio.load(text);
				// 获取已连续登录天数div
				const box = $('#Main .box .cell').last();
				// div中的文本
				const content = box.text();
				// 匹配出登录天数(数字值)
				resolve(/\d+/.exec(content)[0]);
			} catch (e) {
				reject(new Error('获取连续登录天数失败'));
			}
		});
	}

	/**
	 * 用户是否已经领取今日登录奖励
	 * @param text v2exDaily页面的HTML
	 * @returns {Promise}
	 */
	_isSigined(text) {
		return new Promise((resolve, reject) => {
			try {
				// 解析页面
				const $ = cheerio.load(text);
				// 获取?"按钮"
				const btn = $('.super');
				// 如果按钮上的文字是"查看我的账户余额",则说明已经签到
				resolve(btn.val() === '查看我的账户余额');
			} catch (e) {
				reject(new Error('获取连续登录天数失败'));
			}
		});
	}

}

module.exports = new V2exSign('http://v2ex.com');
