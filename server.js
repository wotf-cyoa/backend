var app = require('http').createServer(),
    io = require('socket.io').listen(app),
    spawn = require('child_process').spawn,
    fs = require('fs'),
    s3 = require('./s3');

var generateUserid = function() {
    var id = (Math.random().toString(36)+'00000000000000000').slice(2, 8);
    if (connectedUsers[id] === undefined) return id;
    else return generateUserid();
};

var connectedUsers = {};

var coders = io.of('/ruby').on('connection', function(socket) {

    var ruby,
        userid,
        socketOn = false;

    socket.on('codeBuild', function(data) {
        console.log(data);

        var fileSaveError,
            codeLoadError;

        // Save file
        s3.uploadFile(userid + '.rb', data.fileContent, function(error) {
            fileSaveError = error;

            // Emit file saved
            socket.emit('buildStatus', {
                output: error || 'Code saved.'
            });

            // Check file syntax?

            // Kill old IRB
            if (ruby) {
              oldRuby = ruby;
              oldRuby.kill();
            }

            // Start IRB
            ruby = spawn('irb');

            ruby.stdout.setEncoding('utf8');
            ruby.stderr.setEncoding('utf8');

            // Funnel file into IRB
            socketOn = false;
            ruby.stdin.write(data.fileContent + '\n', function(error) {
                codeLoadError = error;

                // Emit code loaded
                socket.emit('buildStatus', {
                    output: error || 'Game loaded.'
                });

                if (!fileSaveError && !codeLoadError) {
                    socket.emit('buildStatus', {
                        output: 'Build successful!'
                    });
                } else {
                    socket.emit('terminalError', {
                        output: 'Build failed!'
                    });
                }
            });

            // Bind events on IRB
            ruby.stdout.on('data', function(data) {
                console.log(ruby.pid + ' STDOUT: ' + data);
                if (socketOn) {
                    console.log('socket on');
                    socket.emit('terminalOutput', {
                        output: data.replace(/^(\b|\s)\w+\(\)(\s\n|\n)/, '')
                    });
                }
            });

            ruby.stderr.on('data', function(data) {
                console.log(ruby.pid + ' STDERR: ' + data);
                socket.emit('terminalError', {
                    output: data
                });
            });

            ruby.on('close', function(code) {
                console.log(ruby.pid + ' Exit code: ' + code);
            });

            ruby.on('exit', function(code) {
                console.log(ruby.pid + ' Exit code: ' + code);
                if (code === 0) {
                    socket.emit('terminalError', {
                        output: 'Ruby process exited.'
                    });
                }
            });

        });
    });

    socket.on('terminalInput', function(data) {
        console.log(data);
        socketOn = true;
        try {
            ruby.stdin.write(data.input + '\n');
        } catch (e) {
            socket.emit('terminalError', {
                output: 'Couldn\'t talk to ruby. Did you Build your game?'
            });
        }
    });

    socket.on('reportUserid', function(data) {
        var oldSocket = connectedUsers[data.userid];
        var newOrAuthenticatedUser = !oldSocket || oldSocket === data.authid;

        if (data.userid && newOrAuthenticatedUser) {
            userid = data.userid;
        } else userid = generateUserid();

        console.log('User ' + userid + ' connected on ' + socket.id);

        // Store socket id because XHR polling causes race conditions
        connectedUsers[userid] = socket.id;
        socket.emit('confirmUserid', {
            userid: userid,
            authid: socket.id
        });

        s3.getFile(userid + '.rb', function(error, contents) {
            if (error) {
                fs.readFile('games/game.rb', function(error, contents) {
                    socket.emit('ready', {
                        output: 'Ready!',
                        fileContent: contents.toString()
                    });
                });
            } else {
                socket.emit('ready', {
                    output: 'Ready! Welcome back.',
                    fileContent: contents.toString()
                });
            }
        });
    });

    socket.on('disconnect', function() {
        console.log('User ' + userid + ' disconnected from ' + socket.id);
        // Only set to false if user doesn't already have a new socket
        if (socket.id == connectedUsers[userid]) {
            connectedUsers[userid] = false;
            console.log('User ' + userid + ' disconnected completely');
        }
    });

});

var players = io.of('/share').on('connection', function(socket) {
    var ruby,
        socketOn = false;

    socket.emit('buildStatus', {
        output: 'Loading game...'
    });

    fs.readFile('games/example-game.rb', function(error, contents) {
        if (error) {
            socket.emit('terminalError', {
                output: 'Error loading game. Try again later.'
            });
        } else {
            // Start IRB
            ruby = spawn('irb');

            ruby.stdout.setEncoding('utf8');
            ruby.stderr.setEncoding('utf8');

            // Funnel file into IRB
            socketOn = false;
            ruby.stdin.write(contents + '\n', function(error) {
                if (error) {
                    socket.emit('terminalError', {
                        output: 'Error loading game. Try again later.'
                    });
                } else {
                    // Emit code loaded
                    socket.emit('buildStatus', {
                        output: 'Game loaded. Type start() to play.'
                    });
                }
            });

            // Bind events on IRB
            ruby.stdout.on('data', function(data) {
                console.log(ruby.pid + ' STDOUT: ' + data);
                if (socketOn) {
                    console.log('socket on');
                    socket.emit('terminalOutput', {
                        output: data.replace(/^(\b|\s)\w+\(\)(\s\n|\n)/, '')
                    });
                }
            });

            ruby.stderr.on('data', function(data) {
                console.log(ruby.pid + ' STDERR: ' + data);
                socket.emit('terminalError', {
                    output: data
                });
            });

            ruby.on('close', function(code) {
                console.log(ruby.pid + ' Exit code: ' + code);
            });

            ruby.on('exit', function(code) {
                console.log(ruby.pid + ' Exit code: ' + code);
                if (code === 0) {
                    socket.emit('terminalError', {
                        output: 'Ruby process exited.'
                    });
                }
            });
        }
    });

    socket.on('terminalInput', function(data) {
        console.log(data);
        socketOn = true;
        try {
            ruby.stdin.write(data.input + '\n');
        } catch (e) {
            socket.emit('terminalError', {
                output: 'Couldn\'t talk to ruby. Did you Build your game?'
            });
        }
    });

    socket.on('resetUsersForLab', function() {
        players.emit('clearUserid');
    });

    socket.on('clearUseridDone', function(data) {
        if (data !== '') console.log(data + ' not clear!');
    });
});

app.listen(process.env.PORT || 8888);
