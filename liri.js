var myKeys = require("./keys.js");

var request = require("request");
var inquirer = require("inquirer");
var twitterAPI = require('node-twitter-api');
var spotify = require('spotify');

var twitter = new twitterAPI({
    consumerKey: myKeys.consumer_key,
    consumerSecret: myKeys.consumer_secret,
	accessToken: myKeys.access_token_key,
	accessTokenSecret: myKeys.access_token_secret
});


var params = "something"

inquirer
  .prompt([
    // Here we give the user a list to choose from.
    {
      type: "list",
      message: "Welcome to LIRI! What can I help you with?",
      choices: ["Print my latest 20 Tweets", "Search for a song", "Search for a movie","I'm feeling lucky (or maybe unlucky....)"],
      name: "options"
    }
  ])
  .then(function(inquirerResponse) {

	if (inquirerResponse.options === "Print my latest 20 Tweets"){
					twitter.verifyCredentials(twitter.accessToken, twitter.accessTokenSecret, params, function(error, data, response) {
						if (error) {
							//something was wrong with either accessToken or accessTokenSecret
							//start over with Step 1
						} else {
							//accessToken and accessTokenSecret can now be used to make api-calls (not yet implemented)
							//data contains the user-data described in the official Twitter-API-docs
							//you could e.g. display his screen_name
							console.log(response);
							console.log(data["screen_name"]);
						}
					});


 	}



 	if (inquirerResponse.options === "Search for a song"){

  			//get the song the user would like to search for
  			inquirer
  				.prompt([
  					{
  						name: "song",
  						message: "What song would you like to search for?"
  					}
  				])
  				.then(function(songResponse) {

  						// error handling for blank term
  						if (songResponse.song) {
  							var track = songResponse.song;
  						}

  						//replace this with reading from file
  						else {
  							searchTerm = "Chickenman";
  							console.log("You didn't enter anything...running search for chickenman...");
  						}

						spotify.search({ type: 'track', query: track }, function(err, data) {
						    if ( err ) {
						        console.log('Error occurred: ' + err);
						        return;
						    }
						 
						    console.log(data); 
						});

  				});



  	}

  	if (inquirerResponse.options === "Search for a movie"){

  			//get the movie the user would like to search for
  			inquirer
  				.prompt([
  					{
  						name: "movie",
  						message: "What movie would you like to search for?"
  					}
  				])
  				.then(function(movieResponse) {

  						// error handling for blank term
  						if (movieResponse.movie) {
  							var searchTerm = movieResponse.movie;
  						}

  						else {
  							searchTerm = "Mr. Nobody";
  							console.log("You didn't enter anything...running search for nobody...");
  						}

  						// modify the request to include the search phrase
						request("http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

								// If the request is successful (i.e. if the response status code is 200)
								if (!error && response.statusCode === 200) {

								// Parse the body of the site and recover just the relevant fields
								console.log("Movie title: " + JSON.parse(body).Title);
								console.log("The movie came out in: " + JSON.parse(body).Year);
								console.log("The IMDB rating is: " + JSON.parse(body).imdbRating);
								console.log("Rotten Tomato gave it: " + JSON.parse(body).Ratings[1].Value);
								console.log("The movie was produced in: " + JSON.parse(body).Country);
								console.log("The movie's original language is: " + JSON.parse(body).Language);
								console.log("The basic plot is: " + JSON.parse(body).Plot);
								console.log("The actors are: " + JSON.parse(body).Actors);
								}
						});

  				});



  	}



});