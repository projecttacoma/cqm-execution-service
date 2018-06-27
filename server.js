const express = require('express');
//const engine = require('js-ecqm-engine'); TODO: Add this when js-ecqm-engine is in NPM
const app = express();

app.use(express.json());

LISTEN_PORT = process.env.CQM_EXECUTION_SERVICE_PORT || 8081; // Port to listen on
REQUIRED_PARAMS = ['measure', 'valueSets', 'patients']; // Required params for calculation

/**
 * Version; Informs a client which version of js-ecqm-engine this service
 * is currently utilizing.
 *
 * @name Version
 * @route {GET} /version
 */
app.get('/version', function (request, response) {
  //response.send(engine.version) TODO: Add this when js-ecqm-engine is in NPM
  response.send('0.0.1')
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
app.post('/calculate', function (request, response) {
    // Certain params are required for this action, make sure they exist.
    let missing = []
    REQUIRED_PARAMS.forEach(function (param) {
      if (!request.body.hasOwnProperty(param)) {
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
    response.send({
      'measure': JSON.stringify(measure),
      'valueSets': JSON.stringify(valueSets),
      'patients': JSON.stringify(patients),
      'options': JSON.stringify(options)
    });
});

app.listen(LISTEN_PORT, () => console.log('cqm-execution-service is now listening on port ' + LISTEN_PORT));

app.use(function (request, response, next) {
  response.status(404).send('NOT FOUND')
});
