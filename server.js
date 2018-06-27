const express = require('express')
const app = express()


app.use(express.json());
PORT = process.env.PORT || 8080


app.get('/', (req, res) => res.send('sup dawg'))

app.get('/version', function (req, res) {
    //maybe replace this with git hash
    res.send('0.0.1')
  })

app.post('/calculate', function (req, res) {
    // console.log(req.body)
    blob = req.body

    //quick check that at least we have something for each expected parameter - probably just for initial testing
    required_props = ['measure', 'value_sets', 'patients', 'options']
    if (!required_props.every(prop=>blob.hasOwnProperty(prop))) {
        res.status(400).send(
            {'error':'expected a json object with the following properties: '+required_props.join(', ')+'. request is echoed below',
            'request':blob})
        return
    }

    //echo message for testing
    res.send({'success':'got your message, and it had everything expected. request is echoed below','request':blob})
})





app.listen(PORT, () => console.log('app listening on port '+PORT))

app.use(function (req, res, next) {
    res.status(404).send("NOT FOUND")
  })