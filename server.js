var app = require('http').createServer(),
    io = require('socket.io').listen(app),
    exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    fs = require('fs');

exec('IRBRC=\'irb.rc\' irb', function(error, stdout, stderr) {
    console.log(error);
    console.log(stdout);
    console.log(stderr);
});

io.of('/ruby').on('connection', function(socket) {

    var ruby = spawn('irb'),
        socketOn = false;

    ruby.stdout.setEncoding('utf8');
    ruby.stderr.setEncoding('utf8');

    ruby.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
        if (socketOn) {
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

    socket.on('fileLoad', function(data) {
        socketOn = false;
        console.log(data);
        ruby.stdin.write('exec($0)\n');
        setTimeout(function() {
            ruby.stdin.write(data.input + '\n');
            socket.emit('fileLoaded', {
              output: 'Game loaded.'
            });
        }, 1000);
    });

    socket.on('terminalInput', function(data) {
        socketOn = true;
        console.log(data);
        ruby.stdin.write(data.input + '\n');
    });

    socket.on('fileSave', function(data) {
        console.log(data);
        fs.writeFile('games/game.rb', data.fileContent, function(err) {
            socket.emit('fileSaved', {
                output: err || 'Code saved.'
            });
        });
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
