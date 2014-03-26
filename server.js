/** modules declarations **/
var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};


/** Sending file data and error responses **/
function send404(responses){
	responses.writeHead(404, {'Content-Type': 'text/plain'});
	responses.write('Error 404: resource not found. ');
	responses.end();
}

function sendFile(responses, filePath, fileContents){
	responses.writeHead(
		200, 
		{"Content-Type": mime.lookup(path.basename(filePath))}
	);
	responses.end(fileContents);
}

function serveStatic(responses, cache, absPath){
	if(cache[absPath]){
		sendFile(responses, absPath, cache[absPath]);
	}else{
		fs.exists(absPath, function(exists){
			if(exists){

				fs.readFile(absPath, function(err, data){
					if(err){
						send404(responses);
					}else{
						cache[absPath] = data;
						sendFile(responses, absPath, data);
					}
				})
			}else{
				send404(responses);
			}
		});
	}
}


var server = http.createServer();
server.on('request', function (req, res){
	var filePath = false;
	if(req.url == '/'){
		filePath = 'dashboard.html';
		console.log(filePath);
	}else{
		filePath = req.url;
	}

	var absPath = './' + filePath;
	serveStatic(res, cache, absPath)

});

server.listen(3000);
console.log('Server running at http://localhost:3000/');

