var app        = require(process.cwd() + '/app')
    , assert   = require("assert")
    , request  = require('request')
    , should   = require('should')
    , describe = require('describe');

const URL = "http://localhost:3000";


it('GET must respond with 200', function (done) {
    request.get(URL, function (err, res, body) {
        should.not.exist(err);
        res.statusCode.should.eql(200, 'status code is not 200');
        done();
    });
});

it('POST must respond with 200', function (done) {
    request.get(URL, function (err, res, body) {
        should.not.exist(err);
        res.statusCode.should.eql(200, 'status code is not 200');
        done();
    });
});

it('custom controller', function (done) {
    request.get(URL + '/custom', function (err, res, body) {
        should.not.exist(err);
        res.statusCode.should.eql(200, 'status code is not 200');
        done();
    });
});

it('custom controller directory', function (done) {
    request.get(URL + '/customdir', function (err, res, body) {
        should.not.exist(err);
        res.statusCode.should.eql(200, 'status code is not 200');
        done();
    });
});

it('policy test', function (done) {
    request.get(URL + '/policy', function (err, res, body) {
        should.not.exist(err);
        res.statusCode.should.eql(200, 'status code is not 200');
        done();
    });
});

it('policy array test', function (done) {
    request.get(URL + '/policyarray', function (err, res, body) {
        should.not.exist(err);
        res.statusCode.should.eql(200, 'status code is not 200');
        done();
    });
});

it('test global', function (done) {
    request.get(URL + '/testglobal', function (err, res, body) {
        should.not.exist(err);
        res.statusCode.should.eql(200, 'status code is not 200');
        done();
    });
});

describe('simple routing', function () {


    describe('index GET', function () {

        it('GET must respond with 200', function (done) {
            request.get(URL, function (err, res, body) {
                should.not.exist(err);
                res.statusCode.should.eql(200, 'status code is not 200');
                done();
            });
        });
    });

    describe('index GET', function () {

        it('POST must respond with 200', function (done) {
            request.get(URL, function (err, res, body) {
                should.not.exist(err);
                res.statusCode.should.eql(200, 'status code is not 200');
                done();
            });
        });
    });

    describe('this route can not exist', function () {
        it('it must return 404', function (done) {
            request.get(URL + "/notexist", function (err, res, body) {
                should.not.exist(err);
                res.statusCode.should.eql(404, 'wrong status code returned from server');
                done();
            });
        });

    });

});

