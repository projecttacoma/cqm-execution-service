//const models = require('cqm-models'); TODO: Add this when cqm-models is in NPM
//const engine = require('js-ecqm-engine'); TODO: Add this when js-ecqm-engine is in NPM
var app = require('express')();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var winston = require('winston');

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: '5000'}));

LISTEN_PORT = process.env.CQM_EXECUTION_SERVICE_PORT || 8081; // Port to listen on
REQUIRED_PARAMS = ['measure', 'valueSets', 'patients']; // Required params for calculation

// Log errors to error.log and all messages to combined.log
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error'}),
    new winston.transports.File({ filename: 'combined.log'})
  ]
});

// If we're not in production, log to console as well
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.simple()
    )
  }), {timestamp: true});
}


/**
 * Version; Informs a client which version of js-ecqm-engine and cqm-models this
 * service is currently utilizing.
 *
 * @name Version
 * @route {GET} /version
 */
app.get('/version', function (request, response) {
  logger.log({
    level: 'info',
    message: 'GET /version headers: ' + JSON.stringify(request.headers)
  });

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
    logger.log({
      level: 'error',
      message: 'GET /calculate missing params, headers: ' + JSON.stringify(request.headers)
    });
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

  logger.log({
    level: 'info',
    message: 'GET /calculate measure: ' + measure['cms_id'] + 'patient_count: ' + patients.length
  });
  // TODO: Incorporate js-ecqm-engine to actually do calculation.
  response.json({
    'measure': measure,
    'valueSets': valueSets,
    'patients': patients,
    'options': options
  });
});

app.use(function (request, response, next) {
  response.status(404).send()
});

module.exports = app.listen(LISTEN_PORT, () => logger.log({level: 'info', message: 'cqm-execution-service is now listening on port ' + LISTEN_PORT}));
