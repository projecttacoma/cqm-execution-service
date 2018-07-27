const request = require('supertest');
const fs = require('fs');
const path = require('path');

const testAgainstAlreadyRunningServer = (process.argv[3] == 'againstRunning')

const basePath = path.join('spec', 'fixtures', 'json');
const getJSONFixture = (fixturePath) => {
  var contents = fs.readFileSync(path.join(basePath, fixturePath));
  return JSON.parse(contents);
}

const valueSetsByOid = getJSONFixture('measures/CMS137v7/value_sets.json');
const measure = getJSONFixture('measures/CMS137v7/CMS137v7.json');
const ippPopFail = getJSONFixture('patients/CMS137v7/2YoungDependence&TX_IPPPopFail.json');
const denexPop18StratPass = getJSONFixture('patients/CMS137v7/Dependency<60daysSB4_DENEXPop>18StratPass.json');
const pop1_1318Pass = getJSONFixture('patients/CMS137v7/Therapy<14DaysDx_NUMERPop1_13-18Pass.json');
const patients = [];
patients.push(ippPopFail);
patients.push(denexPop18StratPass);
patients.push(pop1_1318Pass);
const options = {}


describe('cqm-execution-service', function () {
  var server;

  beforeEach(function () {
    server = testAgainstAlreadyRunningServer ? 'http://localhost:8081' : require('../server');
  });

  afterEach(function () {
    if (!testAgainstAlreadyRunningServer)
      server.close();
  });

  it('responds to /version', function testVersion(done) {
    request(server).get('/version').expect(200, done);
  });


  it('responds to /calculate with the result to a correct post', function testCalculate(done) {
    let data = {
      'measure': measure,
      'valueSetsByOid': valueSetsByOid,
      'patients': patients,
      'options': options
    }

    request(server).post('/calculate').send(data).expect('Content-Type', /json/).expect(200,done)
  });

  it('responds to /calculate with 400 to missing params', function testCalculateWOParams(done) {
    request(server).post('/calculate').send({}).expect(400, done);
  });

  it('responds to /calculate with 400 to value sets as array instead of object', function testCalculateWOParams(done) {
    let data = {
      'measure': measure,
      'valueSetsByOid': ["a","b"],
      'patients': patients,
      'options': options
    }
    request(server).post('/calculate').send(data).expect(400, done);
  });

  it('responds to /calculate with 500 for data that causes calculation to fail', function testCalculateWOParams(done) {
    let measure = getJSONFixture('measures/CMS137v7/CMS137v7.json');
    delete measure.elm;
    let data = {
      'measure': measure,
      'valueSetsByOid': valueSetsByOid,
      'patients': patients,
      'options': options
    }
    request(server).post('/calculate').send(data).expect(500, done);
  });

  it('responds with a 404 for bogus paths', function test404(done) {
    request(server).post('/foo').send({}).expect(404, done);
  });
});

