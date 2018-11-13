const app = require('express')();
const bodyParser = require('body-parser');
const calculator = require('cqm-execution').Calculator;
const compression = require('compression');
const winston = require('winston');

app.use(compression());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: '5000' }));

const LISTEN_PORT = process.env.CQM_EXECUTION_SERVICE_PORT || 8081; // Port to listen on
const REQUIRED_PARAMS = ['measure', 'valueSetsByOid', 'patients']; // Required params for calculation


// All logging is to the console, docker can save these messages to file if desired
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: (process.env.NODE_ENV == 'test') ? [new winston.transports.File({ filename: 'test_log.info'})] : [ new winston.transports.Console() ]
});


/**
 * Version; Informs a client which version of js-ecqm-engine and cqm-models this
 * service is currently utilizing.
 *
 * @name Version
 * @route {GET} /version
 */
app.get('/version', function (request, response) {
  logger.log({ level: 'info', message: 'GET /version. headers: ' + JSON.stringify(request.headers) });
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
 * @bodyparam valueSetsByOid - the value sets to use when calculating the measure. Must be an object keyed by OID and then version.
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
    logger.log({ level: 'error', message: `GET /calculate. missing params ${missing.join(', ')}, headers: ${JSON.stringify(request.headers)}` });
    response.status(400).send({
      error: `Missing required parameter(s): ${missing.join(', ')}`, request: request.body
    });
    return;
  }

  // Grab params from request.
  const {measure, valueSetsByOid, patients, options = {}} = request.body

  if (Array.isArray(valueSetsByOid)){
    logger.log({ level: 'error', message: 'GET /calculate. valueSets passed as array, headers: ' + JSON.stringify(request.headers) });
    response.status(400).send({'input error': 'value sets must be passed as an object keyed by oid and then version, not an array'});
    return;
  }

  try {
    results = calculator.calculate(measure, patients, valueSetsByOid, options);
    logger.log({ level: 'info', message: 'GET /calculate. measure: ' + measure['cms_id'] + ' patient_count: ' + patients.length });
    response.json(results);
  } catch(error) {
    logger.log({ level: 'error', message: `GET /calculate. error in the calculation engine: ${error} headers: ${JSON.stringify(request.headers)}` });
    response.status(500).send({'error in the calculation engine': error});
    return;
  }

});

app.use(function (request, response, next) {
  response.status(404).send();
});

module.exports = app.listen(LISTEN_PORT, () =>
{
  logger.log({level: 'info', message: 'cqm-execution-service is now listening on port ' + LISTEN_PORT});
  app.emit("listening")
});
