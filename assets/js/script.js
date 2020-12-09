
//global variables
var apiKeyOmdb = "cefb15b1";
var movieInput = document.querySelector("#movie-search");
var searchedVideoId; //create global variabe for the searched videoid
var movieInfo = document.querySelector("#movie-info");
var searchHistoryContainer = document.querySelector("#search-history");
var movieHistoryArr = JSON.parse(localStorage.getItem("movieHistory")) || []; //get history from local storage or initialize array
var addToWatchBtn = document.querySelector("#add-to-watch");

//The search feature does not work without this commented out
// var movieWatchList = JSON.parse(localStorage.getItem("watchList")) || [];
var omdbDataObject = "";

/*Use the youtube data api to collect video info for the movie search term*/
var youtubeApiKey = "AIzaSyA4BlhB5mPVahDpSC1lLhrGoTy2vI2eEdI";

function getMovieTrailer(movie, year) {
    var trailerContentEl = document.querySelector("#youtube-trailer");
    trailerContentEl.src = "";

    movie += " " + year + " trailer";
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
    document.getElementById("youtube-trailer").setAttribute("uk-video","");
    document.getElementById("youtube-trailer").setAttribute("uk-responsive","");
}

function submitMovieHandler(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        var movie = movieInput.value;
        movieInput.value = "";

        callOmdb(movie);
        saveMovieHistory(movie);
        UIkit.modal(document.getElementById("movie-modal")).show();
        
    }
}

// AJZ working on function to call OMDB and return info on a movie
var callOmdb = function (movie) {
    movieInfo.innerHTML = "";//AJZ clearing previous search results 
    var omdbUrl = "https://www.omdbapi.com/?t=" + movie + "&plot=full&apikey=" + apiKeyOmdb;
    fetch(omdbUrl).then(function (response) {
        return response.json();
    }).then(function (data) {
        //AJZ seeing if the API returned a valid response
        if (data.Response === "True") {

            //AJZ creating elements to display information about the movie
            var movieTitle = document.createElement("h1");//AJZ movie title
            var rating = document.createElement("li");//AJZ movie rating and runtime
            var AndRun = document.createElement("li");//AJZ movie rating and runtime
            var plotInfo = document.createElement("p"); //AJZ plot
            var castList = document.createElement("div"); //AJZ cast list
            //Dynamic Styling to Cast List with UI features
            castList.className = "uk-card uk-card-default uk-card-body uk-width-1-2@m";
            castList.innerHTML = '<h3 class="uk-card-title"><i class="fas fa-theater-masks"></i> Cast</h3>'

            var moviePoster = document.createElement("img"); //AJZ movie poster
            //getting cast list and making an array of names
            var castRoster = new Array();
            castRoster = data.Actors.split(",");
            for (var i = 0; i < castRoster.length; i++) {
                var cast = document.createElement("p");
                //add UI styling
                cast.className = "align-list";
                cast.textContent = castRoster[i];
                castList.appendChild(cast);
            }

            movieTitle.textContent = (data.Title + " " + data.Year); //AJZ movie title
            rating.textContent = ("Rated: " + data.Rated);//AJZ rating and runtime
            AndRun.textContent = ("Runtime: " + data.Runtime);//AJZ rating and runtime
            plotInfo.textContent = (data.Plot);//AJZ plot
            moviePoster.setAttribute("src", data.Poster); //AJZ poster

            movieInfo.appendChild(movieTitle);//AJZ movie title
            movieInfo.appendChild(rating);//AJZ movie rating and runtime
            movieInfo.appendChild(AndRun);//AJZ movie rating and runtime
            movieInfo.appendChild(moviePoster);//AJZ poster
            movieInfo.appendChild(plotInfo);//AJZ plot

            movieInfo.appendChild(castList);//AJZ cast list
            //AJZ giving error response to user

            omdbDataObject = data;
            getMovieTrailer(data.Title, data.Year);
            if(checkWatchList()){
                addToWatchBtn.textContent = "Added";
            }
            else {
                addToWatchBtn.textContent = "+ to watch list";
            }
        } 
        else {
            var errorMsg = document.createElement("h1");//AJZ error msg
            errorMsg.textContent = ("Looks like something went wrong: "
                + data.Error + " Please try again.");//AJZ error msg
            movieInfo.appendChild(errorMsg);//AJZ error msg
        }
    })


};

function saveMovieHistory(movie) {
    var searched = movieHistoryArr.indexOf(movie); //check if movie has already been searched for and return index
    if (searched > -1) { //if movie was found remove from array
        movieHistoryArr.splice(searched, 1);
    }
    movieHistoryArr.push(movie);
    if (movieHistoryArr.length > 10) { //keep only the 10 most recent searches
        movieHistoryArr.shift();
    }
    localStorage.setItem("movieHistory", JSON.stringify(movieHistoryArr));
    displayMovieHistory();
}

function displayMovieHistory() {
    searchHistoryContainer.innerHTML = "";
    for (var i = 1; i <= movieHistoryArr.length; i++) {
        var buttonEl = document.createElement("button");
        buttonEl.classList.add("uk-text-capitalize");
        buttonEl.setAttribute("searched-movie", movieHistoryArr[movieHistoryArr.length - i]);
        buttonEl.textContent = movieHistoryArr[movieHistoryArr.length - i];

        searchHistoryContainer.appendChild(buttonEl);
    }
}

function movieClickHandler(event) {
    var movie = event.target.getAttribute("searched-movie");
    if (movie) {
        callOmdb(movie);
        saveMovieHistory(movie);
        UIkit.modal(document.getElementById("movie-modal")).show();
    }
}

function addToWatchList() {
    if (checkWatchList()) { //if movie was found don't add to watchList
        return;
    }
    addToWatchBtn.textContent = "Added";
    movieWatchList.push(omdbDataObject);
    localStorage.setItem("watchList", JSON.stringify(movieWatchList));
    
}

function checkWatchList() {
    var searched = movieWatchList.findIndex(movie => movie.Title == omdbDataObject.Title);
    if (searched > -1){ 
        return true;
    }
    else {
        return false;
    }
}

//must use keydown for event listener to prevent page from refreshing on enter key pressed
movieInput.addEventListener("keydown", submitMovieHandler);
searchHistoryContainer.addEventListener("click", movieClickHandler);
addToWatchBtn.addEventListener("click", addToWatchList);
displayMovieHistory();