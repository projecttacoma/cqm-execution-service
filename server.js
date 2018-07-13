//const models = require('cqm-models'); TODO: Add this when cqm-models is in NPM
//const engine = require('js-ecqm-engine'); TODO: Add this when js-ecqm-engine is in NPM
var app = require('express')();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

const calculator = require('cqm-execution').Calculator;
// const calculate_with_patients = require('cqm-execution').calculate_with_patients;

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: '5000'}));

LISTEN_PORT = process.env.CQM_EXECUTION_SERVICE_PORT || 8081; // Port to listen on
REQUIRED_PARAMS = ['measure', 'valueSets', 'patients']; // Required params for calculation

/**
 * Version; Informs a client which version of js-ecqm-engine and cqm-models this
 * service is currently utilizing.
 *
 * @name Version
 * @route {GET} /version
 */
app.get('/version', function (request, response) {
  response.send({
    'js-ecqm-engine': '?', //response.send(engine.version) TODO: Add this when js-ecqm-engine is in NPM
    'cqm-models': '?' //response.send(models.version) TODO: Add this when cqm-models is in NPM
  });
});

/**
 * Calculate a CQM.
 *
 * @name Calculate
 * @route {POST} /calculate
 * @bodyparam measure - the cqm to calculate against.
 * @bodyparam valueSets - the value sets to use when calculating the measure.
 * @bodyparam patients - an array of cqm-models based patients to calculate for.
 * @bodyparam options - optional params for things like generating pretty results.
 */
app.post('/calculate', upload.array(), function (request, response) {
  // Certain params are required for this action, make sure they exist.
  let missing = []
  REQUIRED_PARAMS.forEach(function (param) {
    if (!request.body[param]) {
      missing.push(param);
    }
  });
  // If there are missing params, return a 400 with a description of which
  // params were missing.
  if (missing.length) {
    response.status(400).send({
      'error': `Missing required parameter(s): ${missing.join(', ')}`, 'request': request.body
    });
    return;
  }

  var fs = require('fs');
  fs.writeFile('last_received.json', JSON.stringify(request.body), 'utf8',(err) => {  
    if (err) throw err;
    console.log('dawg');
  });
  // return

  // Grab params from request.
  var measure = request.body['measure'];
  var valueSets = request.body['valueSets'];
  var patients = request.body['patients'];
  var options = request.body['options'] || {};

  // We can take in either an array of value sets, or an object of value sets keyed by oid (the calculator needs the latter)
  if (Array.isArray(valueSets)){
    valueSetsByOid = {}
    for (let valueSet of valueSets) {
      valueSetsByOid[valueSet.oid] = valueSet
    }
  } else {
    valueSetsByOid = valueSets
  }

  results = calculator.calculate(measure, patients, valueSetsByOid, options)

  fs.writeFile('last_sent.json', JSON.stringify(results), 'utf8',(err) => {  
    if (err) throw err;
    console.log('dawg');
  });

  response.json(results)
});

app.use(function (request, response, next) {
  response.status(404).send()
});

module.exports = app.listen(LISTEN_PORT, () => console.log('cqm-execution-service is now listening on port ' + LISTEN_PORT));

