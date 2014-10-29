var http = require('http'),
    url = require('url'),
    jf = require('jsonfile');


http.createServer(function (request, response) {

    var path = url.parse(request.url).pathname.split('_');
    console.log(path);

    if (path[0] == '/getdata') {
        var file = 'data.json';
        var data = [];
        jf.readFile(file, function (err, obj) {
            if (!((path[1]) && (path[2]))) {
                response.writeHead(200, { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*' });
                //console.log(obj.length);
                data = JSON.stringify(obj);
                //console.log(data);
                response.end(data);
            }
            else {
                for (var i = +path[1]; i < +path[2]; i++) {
                    console.log(obj[i]);
                    if (obj[i])
                        data.push(obj[i]);
                }
                ;
                console.log(data);
                response.writeHead(200, { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*' });
                response.end(JSON.stringify(data) + "__objectmaxlength__" + obj.length.toString());
            }
        });
    }
}).listen(8001);
console.log("server initialized");