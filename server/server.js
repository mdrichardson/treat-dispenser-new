const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create server and load separate api.js file
const app = express();
const api = require('./routes/api');

// Force SSL
const https = require('https');
const fs = require('fs');

const privateKey = fs.readFileSync('../ssl/server.key', 'utf8');
const certificate = fs.readFileSync('../ssl/server.crt', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
};

// Starting both http & https servers
const httpsServer = https.createServer(credentials, app);

app.use(cors());
app.use(bodyParser.json());

app.use('/api', api);
app.get('/', function(req, res){
    res.send('Test successful!')
})

httpsServer.listen(3000, () => {
	console.log('HTTPS Server running on port 443');
});