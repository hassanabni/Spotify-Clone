let currentSong = new Audio ;
let prevBtn = document.getElementById("previous");
let playBtn = document.getElementById("play");
let nextBtn = document.getElementById("next");
let currFolder ; 
let songs ; 

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60); // Get the number of minutes
    let remainingSeconds = seconds % 60;   // Get the remaining seconds

    // Pad the values with leading zeros if needed
    let formattedMinutes = String(minutes).padStart(2, '0');
    let formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function setSongs(folder) {
    currFolder = folder ;
        let a = await fetch(`/${folder}/`);
        let response = await a.text();
        
        let div = document.createElement("div");
        div.innerHTML = response;

        let as = div.getElementsByTagName("a");
        songs = [];
        for (let i = 0; i < as.length; i++) {
            const element = as[i];
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href.split(`/${folder}/`)[1]);
            }
        }
        //show all songs in the list
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "" ;
    for(let song of songs){
        songUL.innerHTML = songUL.innerHTML + `<li> <img class="invert" src="assets/musicBtn.png" alt="">
                        <div class="info">
                            <div>${song.replaceAll("%20", " ")}</div>

                            <div>Hassan</div>
                        </div>
                        <div class="playNow">
                            <span>Play Now</span>
                            <img class="invert" src="assets/playBtn.png" alt="">
                        </div> </li>`
    }
    //Attach an event listener to each song.
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click",(element)=>{       
            playSong(e.querySelector(".info").firstElementChild.innerHTML.trim());   
        })
    });
    return songs;
}

function playSong(track,pause=false){
    // let audio = new Audio("/songs/" + track);
    currentSong.src = (`/${currFolder}/` + track)
    if(!pause){
        currentSong.play();
        play.src = "assets/pauseBtn.png" ;
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track) ;
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
}
/*
async function displayAlbums() {
        let a = await fetch(`/songs/`);
        let response = await a.text();

        let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            console.log(folder)
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json(); 
            console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + `<div class="card rounded" data-folder="${folder}">
                    <div class="play">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5" stroke-linejoin="round"></path>
                        </svg>
                    </div>
                    <img src="/songs/${folder}/cover.jpg" alt="Happy Hits">
                    <h2>${response.title}</h2>
                    <p>${response.description}</p>
                </div>`
        }
    }          
}
    */

async function main() {
    await setSongs('songs/ncs');
    playSong(songs[0],true);

//display all the albums on the page
// displayAlbums()

    //Attach an event listener to prev, play and next buttons each.
    play.addEventListener('click',() =>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "assets/pauseBtn.png" ;
        }
        else{
            currentSong.pause();
            play.src = "assets/playBtn.png" ;
        }
    })

    //Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {

        // Check if duration is available
        if (!isNaN(currentSong.duration)) {
            document.querySelector(".songTime").innerHTML = 
                `${formatTime(Math.floor(currentSong.currentTime))} / ${formatTime(Math.floor(currentSong.duration))}`;
            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration)*100 + "%"
        }
    });

// add an event listener to seekbar
document.querySelector(".seekbar").addEventListener("click",(e)=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
    document.querySelector('.circle').style.left = percent + '%';
    currentSong.currentTime = ((currentSong.duration)* percent)/100 ;
})

//Add an event listener to hamburger
document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left = '0%' ;
})
//Add an event listener to CLOSE hamburger
document.querySelector(".cross").addEventListener("click",()=>{
    document.querySelector(".left").style.left = '-110%' ;
})

//Add an event listener to previous
prevBtn.addEventListener('click', () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((index - 1) >= 0) {
        playSong(songs[index - 1]);
    }
});

nextBtn.addEventListener('click', () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((index + 1) < songs.length) { // Use songs.length instead of length
        playSong(songs[index + 1]);
    }
});

//add an event listener to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener('change',(e)=>{
    currentSong.volume = parseInt(e.target.value)/100;
    console.log(`Volume is set to ${parseInt(e.target.value)}/100`)
})

//add the playlist when card is clicked
Array.from(document.getElementsByClassName("card")).forEach(e =>{
    e.addEventListener('click',async item =>{
        console.log("fetching songs");
        songs = await setSongs(`songs/${item.currentTarget.dataset.folder}`)  ;
    })
})

}
main();
