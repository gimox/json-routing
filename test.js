var app     = require(process.cwd()+'/app');
var assert = require("assert");
var request = require('request');
var should = require('should');

const URL   = "http://localhost:3000";

describe('simple routing', function() {



    describe('index GET', function() {

        it('GET must respond with 200', function(done) {
            request.get(URL, function(err, res, body){
                should.not.exist(err);
                res.statusCode.should.eql(200, 'status code is not 200');
                done();
            });
        });
    });

    describe('index GET', function() {

        it('POST must respond with 200', function(done) {
            request.get(URL, function(err, res, body){
                should.not.exist(err);
                res.statusCode.should.eql(200, 'status code is not 200');
                done();
            });
        });
    });

    describe('this route can not exist', function() {
        it('it must return 404', function(done) {
            request.get(URL + "/notexist", function(err, res, body){
                should.not.exist(err);
                res.statusCode.should.eql(404, 'wrong status code returned from server');
                done();
            });
        });

    });

});


describe('extended routing', function() {

    describe('/complex, action=index ', function() {

        it('must respond with 200', function(done) {
            request.get(URL+"/complex", function(err, res, body){
                should.not.exist(err);
                res.statusCode.should.eql(200, 'status code is not 200');
                done();
            });
        });
    });

    describe('/complex/noparams  with {} parameters', function() {

        it('must respond with 200', function(done) {
            request.get(URL+"/complex/noparams", function(err, res, body){
                should.not.exist(err);
                res.statusCode.should.eql(200, 'status code is not 200');
                done();
            });
        });
    });

    describe('/complex/onlyaction, action=onlyaction', function() {

        it('must respond with 200', function(done) {
            request.get(URL+"/complex/onlyaction", function(err, res, body){
                should.not.exist(err);
                res.statusCode.should.eql(200, 'status code is not 200');
                done();
            });
        });
    });

    describe('/complex/custom, controller=custom', function() {

        it('must respond with 200', function(done) {
            request.get(URL+"/complex/custom", function(err, res, body){
                should.not.exist(err);
                res.statusCode.should.eql(200, 'status code is not 200');
                done();
            });
        });
    });

    describe('/complex/actioncontroller, controller=custom, action=customaction', function() {

        it('must respond with 200', function(done) {
            request.get(URL+"/complex/actioncontroller", function(err, res, body){
                should.not.exist(err);
                res.statusCode.should.eql(200, 'status code is not 200');
                done();
            });
        });
    });


});

