var trailerEl = document.querySelector("#youtube-trailer");

/*This section of code was created using https://developers.google.com/youtube/iframe_api_reference
*It creates the youtube IFrame element and places and youtube video player in that element onto the page
*/
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
        videoId: 'YoHD9XEInc0'
    });
}
/*End section using https://developers.google.com/youtube/iframe_api_reference example code*/