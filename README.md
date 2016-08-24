# 基于Node.js的 V2EX 每日自动签到脚本

- 每天定时自动签到
- 签到结果邮件通知
- 签到失败，可以手动触发重新签到

# 配置

```javascript
module.exports = {
	// 触发重新签到的http服务地址
	url: 'https://www.xxx.com',
	// 邮件通知邮箱地址
	noticeEmail: 'xxx@163.com',
	// 发送邮件服务器配置
	email: {
		host: 'smtp.gmail.com',
		port: 465,
		secure: true, // use SSL
		auth: {
			user: 'xxx@gmail.com',
			pass: 'xxx'
		},
		// 是否使用代理。gmail在国内需要代理访问
		// proxy: 'socks5://127.0.0.1:1080'
	},
	// v2ex用户名密码配置
	v2ex: {
		user: 'xxx',
		pass: 'xxx'
	}
}
```
