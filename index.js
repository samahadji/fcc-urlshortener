require('dotenv').config();
const express = require('express');
let bodyParser = require('body-parser');
let validator = require('validator')
const cors = require('cors');
const app = express();
//

let shortUrls = [];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Respond to short URL retrieval
app.get('/api/shorturl/:shorturl', function(req, res) {
  const shortUrl = req.params.shorturl;
  if (shortUrl && validator.isInt(shortUrl)) {
      if (shortUrl <= shortUrls.length) {
        res.redirect(shortUrls[shortUrl-1])
      } else {res.json({ error: 'No short URL found for the given input' });}
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }

});

// Respond to short URL add
app.post('/api/shorturl', function(req, res) {
  let postedUrl = req.body.url;
  if (postedUrl && validator.isURL(postedUrl) ) {
    shortUrls.push(postedUrl)
    res.json({ original_url: postedUrl, short_url: shortUrls.length });

  } else {
    res.json({ error: 'invalid url' });
  }
  
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});


