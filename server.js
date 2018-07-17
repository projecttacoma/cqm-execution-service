var app = require('express')();
var bodyParser = require('body-parser');
var calculator = require('cqm-execution').Calculator;

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: '5000'}));

LISTEN_PORT = process.env.CQM_EXECUTION_SERVICE_PORT || 8081; // Port to listen on
REQUIRED_PARAMS = ['measure', 'valueSetsByOid', 'patients']; // Required params for calculation

/**
 * Version; Informs a client which version of js-ecqm-engine and cqm-models this
 * service is currently utilizing.
 *
 * @name Version
 * @route {GET} /version
 */
app.get('/version', function (request, response) {
  response.send({
    'cqm-execution': '?', //response.send(engine.version) TODO: Add this when cqm-execution is in NPM
    'cqm-models': '?' //response.send(models.version) TODO: Add this when cqm-models is in NPM
  });
});

/**
 * Calculate a CQM.
 *
 * @name Calculate
 * @route {POST} /calculate
 * @bodyparam measure - the cqm to calculate against.
 * @bodyparam valueSetsByOid - the value sets to use when calculating the measure. Can either be an array, or an object keyed by OID and then version.
 * @bodyparam patients - an array of cqm-models based patients to calculate for.
 * @bodyparam options - optional params for things like generating pretty results.
 */
app.post('/calculate', function (request, response) {
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

  // Grab params from request.
  var measure = request.body['measure'];
  var valueSetsByOid = request.body['valueSetsByOid'];
  var patients = request.body['patients'];
  var options = request.body['options'] || {};

  if (Array.isArray(valueSetsByOid)){
    response.status(400).send({'input error': 'value sets must be passed as an object keyed by oid and then version, not an array'})
    return
  }

  try {
    results = calculator.calculate(measure, patients, valueSetsByOid, options)
    response.json(results)
  } catch(error) {
    response.status(500).send({'error in the calculation engine': error})
    return
  }

});

app.use(function (request, response, next) {
  response.status(404).send()
});

module.exports = app.listen(LISTEN_PORT, () => console.log('cqm-execution-service is now listening on port ' + LISTEN_PORT));

