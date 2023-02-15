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



// Set global variables

// TODO: THIS API KEY SHOULD NOT BE EXPOSED
// Not a HUGE risk as anyone can get a key and so there's little reason for anybody to find and abuse this
// But still an issue, and obviously not something I'd do in a real world scenario
const API_KEY = "fKE7SyalORoMRuiAsYzfftcTvhKDg0EeJqo4lMdm";

let app = document.querySelector("#app");
let loadinganim = document.querySelector("#preload");
let manifest;
let datePicker = document.querySelector("#date-form__date");
let form = document.querySelector("#date-form");
let date;

// Logic for submit button, fetches and displays data/images
let submitButton = document.querySelector("#date-form__submit");
submitButton.addEventListener("click", (event) => (getPhotos(event)));


// Fetch photo manifest, animate page load
pagePreload();

async function pagePreload() {  

  let manifestDate = document.querySelector("#manifest-date");

  // TODO: Show loading anim


  // Fetch  manifest
  manifest =  await fetch("https://api.nasa.gov/mars-photos/api/v1/manifests/Curiosity?api_key=" + API_KEY)
  .then(response => response.json())
  .then(data => data);

  console.log("Total photos since mission start: " + manifest.photo_manifest.total_photos);
  

  // Page setup 
  // Set date limits using manifest data
  datePicker.min =  "2012-08-06";
  datePicker.max = manifest.photo_manifest.max_date;
  manifestDate.innerHTML = manifest.photo_manifest.max_date;

  // Show page  
  // Short delay to show logo for testing - remove this later

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

  // TODO: clear results, show loading icon

  // Loading icon animate
  let backgroundPlanet = document.querySelector(".background-planet");
  let planetZoom = [
    {transform: "scale(1)"},
    {transform: "scale(20)"}
  ];

  let planetTiming = {
    duration: 1000,
    iterations: 1,
    easing: "ease-out",
    fill: "forwards"
  }

  backgroundPlanet.animate(planetZoom, planetTiming);

  // Build fetch URL
  let urlPrefix = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=";
  date = datePicker.value;
  let urlSuffix = "&api_key=";
  let fetchURL = new URL(urlPrefix + date + urlSuffix + API_KEY);  
  
  // Fetch 
  let output = await fetch(fetchURL).then(response => response.json()).then(data => data);
  console.log(output);

  //TODO: if no data for this date, display message and early return  
  if (output.photos.length == 0){
    console.log("No data for this date");
    return  
  }

  // Sort data
  let photoArray = [];
  let fhaz = [];
  let rhaz = [];
  let mast = [];
  let chemcam = [];
  let mahli = [];
  let mardi = [];
  let navcam = [];

  for(let i = 0; i < output.photos.length; i++)
  {
    let img = output.photos[i].img_src;
    let camera = output.photos[i].camera.name;
    photoArray.push({camera, img});
  }
  console.log(photoArray);

  photoArray.forEach(element => {

    switch(element.camera) {

      case "FHAZ":
        fhaz.push(element);
        break;

      case "RHAZ":
        rhaz.push(element);
        break;

      case "MAST":
        mast.push(element);
        break;

      case "CHEMCAM":
        chemcam.push(element);
        break;

      case "MAHLI":
        mahli.push(element);
        break;

      case "MARDI":
        mardi.push(element);
        break;

      case "NAVCAM":
        navcam.push(element);
        break;
    }    
  });

  let allPhotos = [fhaz, rhaz, mast, chemcam, mahli, mardi, navcam];
  console.log(allPhotos);

  displayPhotoList(allPhotos);
}



function displayPhotoList(photoArray) {

  // Fetch camera types recorded for today (look up on manifest with date converted to sols)
  // Build new array for each camera type    
  // Sort each photo into appropriate camera array
  // Build list display entry for each photo - "Image # [Button: view] [Button: copy link]"
  // Format each camera array into accordian style display
  
  // TODO: Scrap the above.
  // In previous function generate an array of objects 
 
  

  let resultView = document.querySelector(".results");
  let list = document.createElement('ul');
  
  
  photoArray.forEach((value, index) => {  

    let listData = document.createElement('span');
    let modalButton = document.createElement('button');


    listData.innerHTML = `
    ${value.camera} - <a href=${value.img} target="_blank">${index}</a>
    `;

    let listEntry = document.createElement('li');
    listEntry.appendChild(listData);
    list.appendChild(listEntry);
    
  });

  resultView.appendChild(list);
  resultView.style.opacity = 1;

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