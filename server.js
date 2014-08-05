var app = require('http').createServer(),
    io = require('socket.io').listen(app),
    spawn = require('child_process').spawn,
    fs = require('fs');

io.of('/ruby').on('connection', function(socket) {

    var ruby,
        socketOn = false;

    socket.on('codeBuild', function(data) {
        console.log(data);

        var fileSaveError,
            codeLoadError;

        // Save file
        fs.writeFile('games/game.rb', data.fileContent, function(error) {
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
                console.log('stdout: ' + data);
                if (socketOn) {
                    console.log('socket on');
                    socket.emit('terminalOutput', {
                        output: data
                    });
                }
            });

            ruby.stderr.on('data', function(data) {
                console.log('stderr: ' + data);
                socket.emit('terminalError', {
                    output: data
                });
            });

            ruby.on('close', function(code) {
                console.log('Exit code: ' + code);
            });

        });
    });

    socket.on('terminalInput', function(data) {
        console.log(data);
        socketOn = true;
        if (ruby) {
            ruby.stdin.write(data.input + '\n');
        }
        else {
            socket.emit('terminalError', {
                output: 'Game not built!'
            });
        }
    });

    fs.readFile('games/game.rb', function(err, contents) {
        console.log(contents);
        socket.emit('ready', {
            output: 'Ready!',
            fileContent: contents.toString()
        });
    });
});

app.listen(process.env.PORT || 8888);
