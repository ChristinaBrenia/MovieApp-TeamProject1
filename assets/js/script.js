//global variables
var movieInput = document.querySelector("#movie-search");
var searchedVideoId; //create global variabe for the searched videoid

/*Use the youtube data api to collect video info for the movie search term*/
//get entered search term
//var youtubeApiKey = "";

function getMovieTrailer(movie){
    var trailerContentEl = document.querySelector("#youtube-trailer");
    console.dir(trailerContentEl);

    movie += " trailer";
    movie = movie.replace(/ /g, "+");
    //create api url
    var youtubeDataApiURL = "https://www.googleapis.com/youtube/v3/search?part=id&key=" + youtubeApiKey + "&q=" + movie;

    //fetch youtube data
    fetch(youtubeDataApiURL).then(function(response){
        return response.json()
    }).then(function(youtubeData){
        searchedVideoId = youtubeData.items[0].id.videoId;

        //if first time fetching trailer create iframe element
        if (trailerContentEl.tagName === "DIV"){
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
function onYouTubeIframeAPIReady(){
    player = new YT.Player('youtube-trailer', {
        height: '390',
        width: '640',
        videoId: searchedVideoId
    });
}

function submitMovieHandler(event){
    if(event.keyCode === 13){
        event.preventDefault();

        var movie = movieInput.value;
        movieInput.value = "";

        getMovieTrailer(movie);
    }
}

//must use keydown for event listener to prevent page from refreshing on enter key pressed
movieInput.addEventListener("keydown", submitMovieHandler);