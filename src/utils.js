import request from 'request';

var j = request.jar();
var crequest = request.defaults({jar:j});

function GET(url){
	return new Promise((resolve, reject) => {
		crequest.get(url, (err, res, body) => {
			err ? reject(err) : resolve(body);
		});
	});
}

function POST(url, params, headers){
	return new Promise((resolve, reject) => {
		crequest.post({ url: url, formData: params, headers: headers }, (err, res, body) => {
			err ? reject(err) : resolve(res.statusCode, body);
		});
	});
}

module.exports = {
	GET: GET,
	POST: POST
};
