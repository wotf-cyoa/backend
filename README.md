wotf-cyoa
=========
Wizards of the Future: Code Your Own Adventure

Come uncover the secrets of the magical craft of programming. You will explore a
text adventure game written in the Ruby programming language. While you play
through the story, you will empower your actions with simple program commands.
As you begin, you will soon find that the story leads to a dead-end; at which
point, you will have to leap into the source code and code your way to your own
ending. Or a new beginning! No prior programming experience is necessary.

setup
-----

Install [Node.js](http://nodejs.org)

Install the dependencies with

    npm install

To run the Websockets server that executes the game with the project's IRB config:

    IRBRC=irb.rc node server.js

Changes to `server.js` require a restart. Simply `Ctrl+C` the
`IRBRC=irb.rc node server.js` process and run it again.

To enable S3 uploads of game files (game code will never save unless you do),
you have to set your `AWS_ACCESS_KEY_ID` and your `AWS_SECRET_ACCESS_KEY`:

    export AWS_ACESS_KEY_ID=xxx
    export AWS_SECRET_ACCESS_KEY=yyy
    
You can set these values in `~/.bash_login` for them to persist. You get them
from [AWS](http://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSGettingStartedGuide/AWSCredentials.html).
