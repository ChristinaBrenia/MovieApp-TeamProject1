//AJZ adding movie watch list div so it can be addressed
var movieWatchList = document.querySelector("#movie-watch-list");
var omdbDataObject = "";

//function to load movies on watch list from storage and display it
var displayWatchList = function(){
    loadWatchList = JSON.parse(localStorage.getItem("watchList"));
   
    //looping through all movies in watch list
    for (var j = 0; j < loadWatchList.length; j++){
        var deleteFromWatchList = document.createElement("button");//AJZ delete button
            deleteFromWatchList.className = "uk-button uk-button-primary uk-position-top-center";
        var newMovieDiv = document.createElement("div");//AJZ new div to hold movie content
            newMovieDiv.className = "uk-container uk-container-expand uk-inline";
        var movieTitle = document.createElement("h1");//AJZ movie title
            movieTitle.style.display = 'none';
        var moviePoster = document.createElement("img"); //AJZ movie poster
            moviePoster.className = "";
        
        movieTitle.textContent = (loadWatchList[j].Title + " " + loadWatchList[j].Year); //AJZ movie title
        moviePoster.setAttribute("src", loadWatchList[j].Poster); //AJZ poster
        deleteFromWatchList.textContent = "Delete from watch list";// AJZ delete button
        //AJZ adding class to decide witch entry to delete and id to add event listener
        //to button
        deleteFromWatchList.setAttribute("movieWatchListIndex", j);//AJZ giving each button a numerical class to select movie to delete
        deleteFromWatchList.id = "deleteButton"

        newMovieDiv.appendChild(movieTitle);//AJZ movie title
        newMovieDiv.appendChild(moviePoster);//AJZ poster
        newMovieDiv.appendChild(deleteFromWatchList);// AJZ delete button
        movieWatchList.appendChild(newMovieDiv);


        }
    }
    
    


//AJZ used as a function for delete buttons
movieWatchList.addEventListener("click", function(event){
    //AJZ determining if a button was the target event
    if(event.target.id == "deleteButton"){
        //loading attribute of button to select witch movie to delete
        var deleteSelecetedElement = event.target.getAttribute("movieWatchListIndex");
        console.log(deleteSelecetedElement);
        //AJZ loading local storage to obj
        omdbDataObject = JSON.parse(localStorage.getItem("watchList"));
        //AJZ deleting element selected to be deleted
        omdbDataObject.splice(deleteSelecetedElement,1);
        //AJZ clearing watch list from local storage
        localStorage.removeItem("watchList")
        //AJZ loading the new watch list from obj to local storage
        localStorage.setItem("watchList", JSON.stringify(omdbDataObject));
        //AJZ clearing the page to prepare to repopulate the page
        movieWatchList.innerHTML = "";
        //AJZ repopulating the page
        displayWatchList();

    }
});
displayWatchList();