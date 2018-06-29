var request = require('supertest');
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

  it('responds to /calculate with all params', function testCalculateWParams(done) {
    request(server).post('/calculate').send({measure: 'foo', valueSets: 'bar', patients: ['foobar']}).expect(200, done);
  });

  it('responds to /calculate with missing params', function testCalculateWOParams(done) {
    request(server).post('/calculate').send({}).expect(400, done);
  });

  it('responds with a 404 for bogus paths', function test404(done) {
    request(server).post('/foo').send({}).expect(404, done);
  });
});
