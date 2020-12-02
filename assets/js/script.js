//global variables
//variable for OMDB API key
var apiKeyOmdb = "cefb15b1";
var movieInput = document.querySelector("#movie-search");
var searchedVideoId; //create global variabe for the searched videoid
var movieInfo = document.querySelector("#movie-info");
/*Use the youtube data api to collect video info for the movie search term*/
//get entered search term
var youtubeApiKey = "";

function getMovieTrailer(movie) {
    var trailerContentEl = document.querySelector("#youtube-trailer");
    trailerContentEl.src = "";

    movie += " trailer";
    movie = movie.replace(/ /g, "+");
    //create api url
    var youtubeDataApiURL = "https://www.googleapis.com/youtube/v3/search?part=id&key=" + youtubeApiKey + "&q=" + movie;

    //fetch youtube data
    fetch(youtubeDataApiURL).then(function (response) {
        return response.json()
    }).then(function (youtubeData) {
        searchedVideoId = youtubeData.items[0].id.videoId;

        //if first time fetching trailer create iframe element
        if (trailerContentEl.tagName === "DIV") {
            //load the IFrame API code asynchronously after the searched video id info has been fetched
            var tag = document.createElement("script");

            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
        else { //else iframe element already created. set iframe src to include new videoid searched
            trailerContentEl.src = "https://www.youtube.com/embed/" + searchedVideoId + "?enablejsapi=1&widgetid=1";
        }
    });
}

//create an <iframe> (and youtube player) after the api code downloads. Must be outside of fetch so the IFrame api can call this function when the code is ready
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-trailer', {
        height: '390',
        width: '640',
        videoId: searchedVideoId,
    });
    document.getElementById("youtube-trailer").setAttribute("uk-video", "").setAttribute("uk-responsive", "");
}

function submitMovieHandler(event) {
    if (event.keyCode === 13) {
        event.preventDefault();

        var movie = movieInput.value;
        movieInput.value = "";

        //AJZ calling OMDB api and passing it the movie title searched for
        callOmdb(movie);

        getMovieTrailer(movie);

        UIkit.modal(document.getElementById("movie-modal")).show();
    }
}

// AJZ working on function to call OMDB and return info on a movie
var callOmdb = function (movie) {
    movieInfo.innerHTML = "";//AJZ clearing previous search results 
    var omdbUrl = "http://www.omdbapi.com/?t=" + movie + "&plot=full&apikey=" + apiKeyOmdb;
    fetch(omdbUrl).then(function (response) {
        return response.json();
    }).then(function (data) {
        //AJZ creating elements to display information about the movie

        var movieTitle = document.createElement("h1");//AJZ movie title
        var rating = document.createElement("li");//AJZ movie rating and runtime
        var AndRun = document.createElement("li");//AJZ movie rating and runtime
        var plotInfo = document.createElement("p"); //AJZ plot
        var castList = document.createElement("div"); //AJZ cast list
        var moviePoster = document.createElement("img"); //AJZ movie poster
        //getting cast list and making an array of names
        var castRoster = new Array();
        castRoster = data.Actors.split(",");
        for (var i = 0; i < castRoster.length; i++) {
            var cast = document.createElement("h4");
            cast.textContent = castRoster[i];
            castList.appendChild(cast);
        }

        movieTitle.textContent = JSON.stringify(data.Title + " " + data.Year); //AJZ movie title
        rating.textContent = JSON.stringify("Rated: " + data.Rated);//AJZ rating and runtime
        AndRun.textContent = JSON.stringify("Runtime: " + data.Runtime);//AJZ rating and runtime
        plotInfo.textContent = JSON.stringify(data.Plot);//AJZ plot
        moviePoster.setAttribute("src", data.Poster); //AJZ poster

        movieInfo.appendChild(movieTitle);//AJZ movie title
        movieInfo.appendChild(rating);//AJZ movie rating and runtime
        movieInfo.appendChild(AndRun);//AJZ movie rating and runtime
        movieInfo.appendChild(moviePoster);//AJZ poster
        movieInfo.appendChild(plotInfo);//AJZ plot

        movieInfo.appendChild(castList);//AJZ cast list


    })
};

//must use keydown for event listener to prevent page from refreshing on enter key pressed
movieInput.addEventListener("keydown", submitMovieHandler);