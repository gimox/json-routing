import {routeInfo} from "./demo/server";
import  * as chai from "chai";

const chaiHttp = require("chai-http");
const should = chai.should();
const expect = chai.expect;
const URL = "http://localhost:3000";

chai.use(chaiHttp);


describe('Server is Up: ', () => {
    it('Has 13 routes', () => {
        routeInfo.length.should.be.eql(13);
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

    it('/hasmiddleware POST - as string - has property "mdlw"', (done) => {
        chai.request(URL)
            .post("/hasmiddleware")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("mdlw").eql(true);
                done();
            });
    });

    it('/customMiddlewarePath GET - has custom path middleware - has property "mdlw"', (done) => {
        chai.request(URL)
            .get("/customMiddlewarePath")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("mdlw").eql(true);
                done();
            });
    });


});


describe('Controller custom name: ', () => {

    it('/customControllerPath GET - has custom controller path', (done) => {
        chai.request(URL)
            .get("/customControllerPath")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("message").eql("custom controller");
                done();
            });
    });

});


describe('Global params: ', () => {
    it('/other/hasbaseUrl GET - BASEURL has "/other"', (done) => {
        chai.request(URL)
            .get("/other/hasbaseUrl")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("message").eql("index other");
                done();
            });
    });

    it('/globalctrl GET - CTRL PATH custom', (done) => {
        chai.request(URL)
            .get("/globalctrl")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("message").eql("custom controller");
                done();
            });
    });

    it('/customctrlroute GET - use ROUTE NOT GLOBAL', (done) => {
        chai.request(URL)
            .get("/globalctrl/customctrlroute")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("message").eql("get index");
                done();
            });
    });


    it('/globalmdlw/plusone GET - MERGE MDLW global with route, has 3 mdlw', (done) => {
        chai.request(URL)
            .get("/globalmdlw/plusone")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("ma").eql(true);
                res.body.should.have.property("mb").eql(true);
                res.body.should.have.property("mc").eql(true);
                done();
            });
    });

});


describe('Regex route: ', () => {
    it('/dragonfly GET - PURE REGEX, RE /.*fly$/', (done) => {
        chai.request(URL)
            .get("/dragonfly")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("message").eql("regex done");
                done();
            });
    });
    it('/dragonflyno GET - must return 404, RE /.*fly$/', (done) => {
        chai.request(URL)
            .get("/dragonflyno")
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });
});