'use strict';

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

var net = require('net');
var http = require('http');
var fs = require('fs');
var queryString = require('querystring');
var sockets = [];
var parseInput = function (input) {
	var reg = /.{2}\s([\d]{8}){1}\s[\d]{2}\/[\d]{2}\/[\d]{2}/i;
	var matched;

	matched = input.match(reg);
	return matched;
};
var doApiCall = function (endpoint, data) {

	var postData = queryString.stringify(data);
	var postOpt = {
		host: 'localhost',
		port: 3000,
		path: endpoint,
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	};

	var req = http.request(postOpt, function (res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			console.log('Response: ' + chunk);
		});
	});

	req.write(postData);
	req.end();
};
var writeLog = function (input, callback) {
	fs.appendFile('log.txt', input, function (err) {
		if (err) { 
			console.log('write log file failed'); 
			throw err; 
		}
		callback();
	});
}

net.createServer(function (socket) {
	sockets.push(socket);
	socket.on('data', function (data) {
		var i;
		var parsedResult;
		var cardId;

		for (i = 0; i < sockets.length; i++) {
			if (sockets[i] === socket) {
				console.log('received socket data....' + data.toString());
				writeLog(data.toString(), function () {
					parsedResult = parseInput(data.toString());
				
					if (parsedResult) {
						cardId = parsedResult[1];
						doApiCall('/records', {cardId: cardId});
					}	
				});
			}
		}
	});
	socket.on('end', function(){
        var i = sockets.indexOf(socket);
        sockets.remove(i);
        console.log('byebye');
    });
}).listen(55056);