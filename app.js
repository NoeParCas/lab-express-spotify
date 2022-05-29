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

//searchse Artist
app.get("/artist-search", (req, res, next) => {

  const{artistSearch} = req.query
  spotifyApi
  .searchArtists(artistSearch)
  .then(data => {
    const artists = data.body.artists.items
    //console.log("DATA FROM API", data)
    //console.log("ARTISTS :", artists )
    // artists.forEach(artist =>{
    //   console.log("Id", artist.id)
    //  })
  
    res.render('artist-search-results', {artists})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/:id", (req, res, next) => {
  const {id} = req.params

  spotifyApi
  .getArtistAlbums(id)
  .then(artistInfo =>{

    const albums = artistInfo.body.items

    res.render("albums", {albums})
  })
  .catch(err => console.log('The error while searching ALBUMS occurred: ', err));
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
