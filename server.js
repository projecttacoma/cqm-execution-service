//const models = require('cqm-models'); TODO: Add this when cqm-models is in NPM
//const engine = require('js-ecqm-engine'); TODO: Add this when js-ecqm-engine is in NPM
var app = require('express')();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

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

  // Grab params from request.
  var measure = request.body['measure'];
  var valueSets = request.body['valueSets'];
  var patients = request.body['patients'];
  var options = request.body['options'] || {};

  // TODO: Incorporate js-ecqm-engine to actually do calculation.
  response.json({
    'measure': measure,
    'valueSets': valueSets,
    'patients': patients,
    'options': options
  });
});

app.listen(LISTEN_PORT, () => console.log('cqm-execution-service is now listening on port ' + LISTEN_PORT));

app.use(function (request, response, next) {
  response.status(404).send('NOT FOUND')
});
