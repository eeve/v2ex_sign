import http from 'http';
import Log from './log';
const log = Log('server');
import app from './app';

const server = http.createServer((req, res) => {
	if (req.method === 'GET' && req.url === '/v2ex') {
		app().then(() => {
			log.info('done');
			res.setHeader('Content-Type', 'text/html;charset=utf-8');
			res.end('<html><body><h1>签到完成！</h1></body></html>');
		});
	} else {
		res.end('ok');
	}
});

server.listen(3001);
log.info('server started on port 3001...');
