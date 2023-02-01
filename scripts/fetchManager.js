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

// TODO: MAKE THIS API KEY NOT EXPOSED
// Not a HUGE risk as anyone can get a key and so there's little reason for anybody to find and abuse this
// But still an issue, and obviously not something I'd do in a real world scenario
const API_KEY = "bRbqYWYktqTKgDMcSsA633XTc8AlHdKoLL9kNtfm";

let app = document.querySelector("#app");
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
  app.animate([
    {opacity: 0},
    {opacity: 1}
  ],
  {duration: 500, fill: "forwards"});

}



async function getPhotos(event) {

  // Form validity check and prevent page reload
  if (form.checkValidity()){
    event.preventDefault();
  } else {
    return;
  } 

  // TODO: clear results, show loading icon


  // Build fetch URL
  let urlPrefix = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=";
  date = datePicker.value;
  let urlSuffix = "&api_key=DEMO_KEY";
  let fetchURL = new URL(urlPrefix + date + urlSuffix);  

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
  for(let i = 0; i < output.photos.length; i++)
  {
    let img = output.photos[i].img_src;
    let camera = output.photos[i].camera.full_name;
    photoArray.push({camera, img});
  }
  displayPhotoList(photoArray);
}



function displayPhotoList(photoArray) {

  // Fetch camera types recorded for today (look up on manifest with date converted to sols)
  // Build new array for each camera type    
  // Sort each photo into appropriate camera array
  // Build list display entry for each photo - "Image # [Button: view] [Button: copy link]"
  // Format each camera array into accordian style display
  
  let todayCameras = getCameraList();  

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