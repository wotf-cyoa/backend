var aws = require('aws-sdk');
aws.config.region = 'us-east-1';

exports.uploadFile = function(fileName, fileContent, callback) {
    var s3 = new aws.S3();
    var data = { Key: fileName, Body: fileContent, Bucket: 'wotf-cyoa' };
    s3.putObject(data, function(err, data) {
        callback(err, data);
    });
};

exports.getFile = function(fileName, callback) {
    var s3 = new aws.S3();
    var data = { Key: fileName, Bucket: 'wotf-cyoa' };
    s3.getObject(data, function(err, data) {
        if (data === null) callback (true, false);
        else callback(err, data.Body);
    });
};
