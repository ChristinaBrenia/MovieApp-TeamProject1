/*Use the youtube data api to collect video info for the movie search term*/

//get entered search term
var movieSearchEl = "Inception trailer";
movieSearchEl = movieSearchEl.replace(/ /g, "+");


//create api url
var youtubeDataApiURL = "https://www.googleapis.com/youtube/v3/search?part=id&key=" + youtubeApiKey + "&q=" + movieSearchEl;

//create global variabe for the searched videoid
var searchedVideoId;

//fetch youtube data
fetch(youtubeDataApiURL).then(function(response){
    return response.json()
}).then(function(youtubeData){
    searchedVideoId = youtubeData.items[0].id.videoId;
    /*This section of code was created using https://developers.google.com/youtube/iframe_api_reference
    *It creates the youtube IFrame element and places and youtube video player in that element onto the *page
    */
    //load the IFrame API code asynchronously after the searched video id info has been fetched
    var tag = document.createElement("script");

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});

//create an <iframe> (and youtube player) after the api code downloads. Must be outside of fetch so the IFrame api can call this function when the code is ready
var player;
function onYouTubeIframeAPIReady(){
    player = new YT.Player('youtube-trailer', {
        height: '390',
        width: '640',
        videoId: searchedVideoId
    });
}
/*End Youtube IFrame api section*/