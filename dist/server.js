/**
 *  node start js
 */

'use strict';

var koa = require('koa'),
	kStatic = require('koa-static'),
	router = require('koa-router')(),
	proxy = require('koa-proxy'),
	httpProxy = require('http-proxy'),	
	bodyParser = require('koa-body-parser');

var app = new koa();

// static directory
app.use(kStatic('./'));

app.use(bodyParser());

// Note: when dev or test valid, else should be removed.
// =================================================
// api proxy
router.get('/api/login', proxy({
	host: 'http://112.74.171.157:8080/api/login'
}));

// register router
app.use(router.routes());

// log exception
app.on('error', function(err) {
	console.log('server error: ', err);
});

var port = normalizePort(process.env.PORT || 3007);
app.listen(port);

console.log('listening on port ' + port);

// convert port
function normalizePort(val) {
	let port = parseInt(val, 10);
	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}
	return false;
}









