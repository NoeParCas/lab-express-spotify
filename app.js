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
    console.log("ALBUMS", albums)

    res.render("albums", {albums})
  })
  .catch(err => console.log('The error while searching ALBUMS occurred: ', err));
})

app.get("/tracks/:id", (req, res, next) => {

  const {id} = req.params

  spotifyApi
  .getAlbumTracks(id,  { limit : 5, offset : 1 })
  .then(tracks =>{
    const albumInfo =tracks.body.items

    //albumInfo.forEach(album =>{
      //console.log("Artistas", album.artists)
      // Artistas [
      //   {
      //     external_urls: {
      //       spotify: 'https://open.spotify.com/artist/53A0W3U0s8diEn9RhXQhVz'
      //     },
      //     href: 'https://api.spotify.com/v1/artists/53A0W3U0s8diEn9RhXQhVz',
      //     id: '53A0W3U0s8diEn9RhXQhVz',
      //     name: 'Keane',
      //     type: 'artist',
      //     uri: 'spotify:artist:53A0W3U0s8diEn9RhXQhVz'
      //   }
      // ]
    //})
    //console.log('TRACKS', albumInfo)

    // TRACKS [
    //   {
    //     artists: [ [Object] ],
    //     available_markets: [],
    //     disc_number: 1,
    //     duration_ms: 235880,
    //     explicit: false,
    //     external_urls: {
    //       spotify: 'https://open.spotify.com/track/0HJQD8uqX2Bq5HVdLnd3ep'
    //     },
    //     href: 'https://api.spotify.com/v1/tracks/0HJQD8uqX2Bq5HVdLnd3ep',
    //     id: '0HJQD8uqX2Bq5HVdLnd3ep',
    //     is_local: false,
    //     name: 'Somewhere Only We Know',
    //     preview_url: null,
    //     track_number: 2,
    //     type: 'track',
    //     uri: 'spotify:track:0HJQD8uqX2Bq5HVdLnd3ep'
    //   },
    res.render("tracks", {albumInfo})
  })
  .catch(err => console.log('The error while searching TRACKS occurred: ', err));
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
