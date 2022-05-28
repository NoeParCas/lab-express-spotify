require('dotenv').config();

const express = require('express');
const ejs = require('ejs');
const path = require('path');
const expressLayouts = require('express-ejs-layouts')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const query = require('express/lib/middleware/query');

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(expressLayouts)

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", (req, res, next) => {
    res.render('index')
})

//get Artist
app.get("/artist-search", (req, res, next) => {
  
  const{artistSearch} = req.query
  spotifyApi
  .searchArtists(artistSearch)
  .then(data => {
    console.log("DATA FROM API", data.body)
    res.render('artist-search-results')
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})







app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
