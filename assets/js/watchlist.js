//AJZ adding movie watch list div so it can be addressed
var movieWatchList = document.querySelector("#movie-watch-list");

//function to load movies on watch list from storage and display it
var displayWatchList = function(){
    loadWatchList = JSON.parse(localStorage.getItem("watchList"));
    if(loadWatchList){
        //looping through all movies in watch list
        for (var j = 0; j < loadWatchList.length; j++){
            var newMovieDiv = document.createElement("div");//AJZ new div to hold movie content
            var movieTitle = document.createElement("h1");//AJZ movie title
            var rating = document.createElement("li");//AJZ movie rating and runtime
            var AndRun = document.createElement("li");//AJZ movie rating and runtime
            var plotInfo = document.createElement("p"); //AJZ plot
            var castList = document.createElement("div"); //AJZ cast list
            var moviePoster = document.createElement("img"); //AJZ movie poster
            //getting cast list and making an array of names
            var castRoster = new Array();
            castRoster = loadWatchList[j].Actors.split(",");
            for (var i = 0; i < castRoster.length; i++) {
                var cast = document.createElement("h4");
                cast.textContent = castRoster[i];
                castList.appendChild(cast);
            }

            movieTitle.textContent = (loadWatchList[j].Title + " " + loadWatchList[j].Year); //AJZ movie title
            rating.textContent = ("Rated: " + loadWatchList[j].Rated);//AJZ rating and runtime
            AndRun.textContent = ("Runtime: " + loadWatchList[j].Runtime);//AJZ rating and runtime
            plotInfo.textContent = (loadWatchList[j].Plot);//AJZ plot
            moviePoster.setAttribute("src", loadWatchList[j].Poster); //AJZ poster

            newMovieDiv.appendChild(movieTitle);//AJZ movie title
            newMovieDiv.appendChild(rating);//AJZ movie rating and runtime
            newMovieDiv.appendChild(AndRun);//AJZ movie rating and runtime
            newMovieDiv.appendChild(moviePoster);//AJZ poster
            newMovieDiv.appendChild(plotInfo);//AJZ plot

            newMovieDiv.appendChild(castList);//AJZ cast list
            movieWatchList.appendChild(newMovieDiv);

        }
    }
    
    

}
displayWatchList();