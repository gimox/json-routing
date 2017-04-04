//let app = require(process.cwd() + '/demo/server'); // start server

import {routeInfo} from "./demo/server";

import  * as chai from "chai";

const chaiHttp = require("chai-http");
const should = chai.should();
const expect = chai.expect;

const URL = "http://localhost:3000";


//import {server} from "./demo/server";

chai.use(chaiHttp);


//let server = require('../demo/server');

describe('Server is Up: ', () => {
    it('Has 9 routes', () => {
        routeInfo.length.should.be.eql(9);
    });

    it('/GET return 200', (done) => {
        chai.request(URL)
            .get('/')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                //res.body.should.be.a('array');
                //res.body.length.should.be.eql(0);
                done();
            });
    });
});


describe('Basic routes: ', () => {
    it('/GET return "get index"', (done) => {
        chai.request(URL)
            .get('/')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('get index');
                done();
            });
    });

    it('/POST return "post index"', (done) => {
        chai.request(URL)
            .post('/')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('post index');
                done();
            });
    });

    it('/GET without route params return "get index"', (done) => {
        chai.request(URL)
            .get('/noroute')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('get index');
                done();
            });
    });

});

describe('Middleware: ', () => {
    it('/hasmiddleware GET - as array - has property "mdlw"', (done) => {
        chai.request(URL)
            .get("/hasmiddleware")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("mdlw").eql(true);
                done();
            });
    });

    it('/hasmiddleware GET - as string - has property "mdlw"', (done) => {
        chai.request(URL)
            .get("/hasmiddlewareString")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("mdlw").eql(true);
                done();
            });
    });


});