const request = require('supertest');
const fs = require('fs');
const path = require('path');

const basePath = path.join('spec', 'fixtures', 'json');
const getJSONFixture = (fixturePath) => {
  var contents = fs.readFileSync(path.join(basePath, fixturePath));
  return JSON.parse(contents);
}


describe('cqm-execution-service', function () {
  var server;

  beforeEach(function () {
    server = require('./server');
  });

  afterEach(function () {
    server.close();
  });

  it('responds to /version', function testVersion(done) {
    request(server).get('/version').expect(200, done);
  });

  // it('responds to /calculate with all params', function testCalculateWParams(done) {
    // request(server).post('/calculate').send({measure: 'foo', valueSets: 'bar', patients: ['foobar']}).expect(200, done);
  // });

  it('calculates the fixture', function testCalculate(done) {
    const valueSetsByOid = getJSONFixture('measures/CMS137v7/value_sets.json');
    const measure = getJSONFixture('measures/CMS137v7/CMS137v7.json');
    const ippPopFail = getJSONFixture('patients/CMS137v7/2YoungDependence&TX_IPPPopFail.json');
    const denexPop18StratPass = getJSONFixture('patients/CMS137v7/Dependency<60daysSB4_DENEXPop>18StratPass.json');
    const pop1_1318Pass = getJSONFixture('patients/CMS137v7/Therapy<14DaysDx_NUMERPop1_13-18Pass.json');
    const patients = [];
    patients.push(ippPopFail);
    patients.push(denexPop18StratPass);
    patients.push(pop1_1318Pass);
    options = {}
    
    data = {
      'measure': measure,
      'valueSets': valueSetsByOid,
      'patients': patients,
      'options': options
    }

    request(server).post('/calculate').send(data).expect(200, done);
  });

  it('responds to /calculate with missing params', function testCalculateWOParams(done) {
    request(server).post('/calculate').send({}).expect(400, done);
  });

  it('responds with a 404 for bogus paths', function test404(done) {
    request(server).post('/foo').send({}).expect(404, done);
  });
});

