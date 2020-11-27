var trailerEl = document.querySelector("#youtube-trailer");

//load the IFrame API code asynchronously
var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//create an <iframe> (and youtube player) after the api code downloads
var player;
function onYouTubeIframeAPIReady(){
    player = new YT.Player('youtube-trailer', {
        height: '390',
        width: '640',
        videoId: 'YoHD9XEInc0',
        events: {
            'onReady': onPlayerReady
        }
    });
}

//the api will call this function when the video player is ready
function onPlayerReady(event) {
    event.target.playVideo();
}