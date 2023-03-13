//// PLAN
// ON PAGE LOAD
// Fetch Curiosity manifest data, get landing & max dates
// Set max range for date picker

// SUBMIT button event
// Disable default form button action
// Fetch and process data for date

// Process photo data
// - Which cameras?
// - #Photos per camera?


// Display photos
// - Split by camera type
// - Show text list with 'see image' button
// - Display as modal OR dropdown w/ lazy loading
// - Option to copy photo link, option to see full size
//// END PLAN


///////////////////////////////////////////////////////////////////////////////////////


// SET GLOBAL VARIABLES

// TODO: This API key should not be exposed!
// Shift key handling to PHP once migrated to LAMP server, request new key.
const API_KEY = "fKE7SyalORoMRuiAsYzfftcTvhKDg0EeJqo4lMdm";

let app = document.querySelector("#app");
let loadinganim = document.querySelector("#preload");
let manifest;
let form = document.querySelector("#date-form");
let date;

// Fetch photo manifest, animate page load
pagePreload();





// PAGE PRELOAD - do tasks before UI renders, then render UI

async function pagePreload() {  

  // Disable page refresh on button click for ALL buttons
  let allButtons = document.querySelectorAll("button");
  allButtons.forEach(element => {
    element.addEventListener("click", event => {
      event.preventDefault();
    });
  });

  // Logic for submit button, fetches and displays data/images
  let submitButton = document.querySelector("#date-form__submit");
  submitButton.addEventListener("click", (event) => (getPhotos(event)));  

  // Fetch  mission manifest, incl. most recent data date
  let manifestDate = document.querySelector("#manifest-date");
  manifest =  await fetch("https://api.nasa.gov/mars-photos/api/v1/manifests/Curiosity?api_key=" + API_KEY)
  .then(response => response.json())
  .then(data => data);  
  
  // Flatpickr library, attach to DOM
  let datePicker = flatpickr("#date-form__date", {disableMobile: "true"});  
 
  // Set date limits using manifest data
  datePicker.set("minDate", "2012-08-06");  
  datePicker.set("maxDate", manifest.photo_manifest.max_date)
  manifestDate.innerHTML = manifest.photo_manifest.max_date;  

  // FLATPICKR INTERACTION HANDLER
  datePicker.config.onClose.push(function(selectedDates, dateStr) { 
  // Reveal submit button. Anims handled in CSS
  if (submitButton.disabled){
    submitButton.removeAttribute("disabled");
  }
  // Parse date
  date = dateStr;  
  document.querySelector("#date-form__date").innerHTML = dateStr;
  });


  // RENDER PAGE, HIDE PRELOAD ANIM
  setTimeout(()=>{
    app.animate([
      {opacity: 0},
      {opacity: 1}
    ],
    {duration: 500, fill: "forwards"});
  
    preload.animate([
      {opacity: 1},
      {opacity: 0}
    ],
    {duration: 500, fill: "forwards"});
  },0)
}











async function getPhotos(event) {

  // Form validity check and prevent page reload
  if (form.checkValidity()){
    event.preventDefault();
  } else {
    return;
  } 

  // Begin animate form, background while results are fetched and processed
  animateToStateViewResults();
  

  // Build fetch URL
  let urlPrefix = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=";
  let urlSuffix = "&api_key=";
  let fetchURL = new URL(urlPrefix + date + urlSuffix + API_KEY);  
  
  // Fetch data  
  let output = await fetch(fetchURL).then(response => response.json()).then(data => data);
 

  //TODO: if no data for this date, display message and early return  
  //TODO: handle reponse error codes
  if (output.photos.length == 0){
    console.log("No data for this date");
    generateResultHtml("Empty");
    return  
  }

// Sort data into 2D array
//   Source data is currently ordered/grouped by camera
//   However including this step so that if data in future is unordered we have a tidy working set
  let photoArray = [];   
  for(let i = 0; i < output.photos.length; i++)
  {
    let img = output.photos[i].img_src;
    let id = output.photos[i].id;
    let camera = output.photos[i].camera.name;
    photoArray.push({camera, id, img});
  }
  
  let photosObjFull = {
    "fhaz": {
      "name": "Front Hazard Avoidance Camera",
      "imgs": []
    },
    "rhaz": {
      "name": "Rear Hazard Avoidance Camera",
      "imgs": []
    },
    "mast": {
      "name": "Mast Camera",
      "imgs": []
    },
    "chemcam": {
      "name": "Chemistry and Camera Complex",
      "imgs": []
    },
    "mahli": {
      "name": "Mars Hand Lens Imager",
      "imgs": []
    },
    "mardi": {
      "name": "Mars Descent Imager",
      "imgs": []
    },
    "navcam": {
      "name": "Navigation Camera",
      "imgs": []
    },
    "unknown": {
      "name": "Unknown Camera Source",
      "imgs": []
    },
  };

  photoArray.forEach(element => {

    switch(element.camera) {

      case "FHAZ":
        photosObjFull.fhaz.imgs.push(element);
        break;

      case "RHAZ":
        photosObjFull.rhaz.imgs.push(element);
        break;

      case "MAST":
        photosObjFull.mast.imgs.push(element);
        break;

      case "CHEMCAM":
        photosObjFull.chemcam.imgs.push(element);
        break;

      case "MAHLI":
        photosObjFull.mahli.imgs.push(element);
        break;

      case "MARDI":
        photosObjFull.mardi.imgs.push(element);
        break;

      case "NAVCAM":
        photosObjFull.navcam.imgs.push(element);
        break;
      
      default:
        photosObjFull.unknown.imgs.push(element);
    }    
  });

  // Create final photos Object to be sent for rendering  
  let photosObjFinal = {};

  // Weed all camera entries that have 0 photos
  for (const key in photosObjFull){   
    if (photosObjFull[key]["imgs"].length != 0){
      photosObjFinal[key] = photosObjFull[key]
    }     
  }   

  // Generate results HTML
  generateResultHtml(photosObjFinal);
}





function generateResultHtml(photosObj) {

  // Generate OUTPUT HTML object - this will be rendered as one object later
  let outputHtml = document.createElement("div");  
  outputHtml.classList.add("results__list")

  // Generate RESULTS HEADER to show date OR error message  
  let resultHeader = document.createElement('h3');
  if(photosObj == "Empty"){
    resultHeader.innerHTML = `
      No photos taken on this date. Pick another day!
    `;    
    outputHtml.appendChild(resultHeader)   
    renderHtml(outputHtml);  
    return; 
  }else{
  resultHeader.innerHTML = `
    Photos taken on ${date}
  `;
  outputHtml.appendChild(resultHeader)
  }
  

  // Iterate over all keys in Photos Object
  for (const key in photosObj){    

    let listContainer = document.createElement('div');
    listContainer.classList.add("results__camera")

    // Generate LIST TITLE for each camera
    let listTitle = document.createElement('div');
    listTitle.classList.add("results__camera__title")
    let cameraName = photosObj[key].name;
    listTitle.innerHTML = `     
        <h3>${cameraName} - ${photosObj[key].imgs.length} photos</h3>      
    `;
    listContainer.appendChild(listTitle);

    // Generate FULL LIST for each camera
    let listContent = document.createElement('ul');      
    listContent.classList.add("results__camera__list")

    // Iterate over each camera's imgs array, and append photo ID# and img elements for each
    // Add buttons markup and classes for each
    photosObj[key].imgs.forEach(element => {
      let listEntry = document.createElement('li');
      listEntry.classList.add("results__list__list-entry");
      listEntry.innerHTML = `
        ID: ${element.id} 
        <a href=${element.img} target="_blank"><img src=${element.img} class="results__list__thumbnail" ></a> 
          <div class="results__list__button-container">
          <button class="results__list__button"><i class="fa-solid fa-maximize"></i></button> 
          <button class="results__list__button"><i class="fa-solid fa-link"></i></button> 
        </div>
      `;
      listContent.appendChild(listEntry);

    });
    // Append the current list (for this camera) to outputHTML
    listContainer.appendChild(listContent);
    outputHtml.appendChild(listContainer);       
  }
  // Once all photo object keys have been iterated over and prepared for rendering
  // Render outputHTML
  renderHtml(outputHtml);  
}



function renderHtml (resultsHtml){
  // Get results DOM element for content insertion
  let resultView = document.querySelector(".results");

  // Clear previous results from DOM. While firstChild exists, remove firstChild
  while (resultView.firstChild){
  resultView.removeChild(resultView.firstChild);
  }


  // Render to DOM
  resultView.appendChild(resultsHtml);
  // TODO: Fade opacity instead

  // Animate results - fade in
  let resultsFade= [
    {opacity: 0},
    {opacity: 1}
    
  ];

  let resultsFadeTiming= {
    delay: 1500,
    duration: 500,
    iterations: 1,
    easing: "ease-in",
    fill: "forwards"
  }

  resultView.animate(resultsFade, resultsFadeTiming);
  generateUIInteractions();

}


function getCameraList() {
  
  let todayManifestIndex = manifest.photo_manifest.photos.findIndex(element => {
    if(element["earth_date"] == date){
      return true;
    }
  });
  
  let cameraArray = manifest.photo_manifest.photos[todayManifestIndex].cameras; 

  return cameraArray;
}



function animateToStateViewResults() {

    // Animate moons - fade out
    let moons = document.querySelectorAll(".background-planet__moon");
    let moonFade = [
      {opacity: 1},
      {opacity: 0}
    ];

    let moonTiming = {
      duration: 600,
      iterations: 1,
      easing: "ease-out",
      fill: "forwards"
    }
    moons.forEach(element => element.animate(moonFade, moonTiming));
  
    // Animate orbit lines - fade out
    let orbits = document.querySelectorAll(".background-planet__moon-orbit");
    let orbitFade = [
      {opacity: 1},
      {opacity: 0}
    ];
  
    let orbitTiming = {    
      delay: 500,
      duration: 200,
      iterations: 1,
      easing: "ease",
      fill: "forwards"
    }
    orbits.forEach(element => element.animate(orbitFade, orbitTiming));  
  
    // Animate globe - zoom in
    // Retain existing transform settings, because css transform: only allows one declaration per element
    let backgroundPlanet = document.querySelector(".background-planet__globe-container");
    let planetZoom = [
      {transform: "scale3d(1,1,1) rotateX(-80deg)"},
      {transform: "scale3d(25,25,25) rotateX(-80deg) rotateZ(-70deg)"}    
    ];
  
    let planetTiming = {
      delay: 1000,
      duration: 5000,
      iterations: 1,
      easing: "ease",
      fill: "forwards"
    }  
    backgroundPlanet.animate(planetZoom, planetTiming);
}



// Handle UI interactions hide/show photo list per camera
// results__camera__title

function generateUIInteractions(){

  let listHeaders = document.querySelectorAll(".results__camera__title");

  listHeaders.forEach(element => {
    let target = element.nextElementSibling;
    element.addEventListener("click", (event) => {
      target.classList.toggle("height-test");
    });

  });



}
