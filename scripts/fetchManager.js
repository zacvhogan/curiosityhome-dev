// API key bRbqYWYktqTKgDMcSsA633XTc8AlHdKoLL9kNtfm


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

const API_KEY = "bRbqYWYktqTKgDMcSsA633XTc8AlHdKoLL9kNtfm";

let app = document.querySelector("#app");
let manifest;
let datePicker = document.querySelector("#date-form__date");
let form = document.querySelector("#date-form");

let submitButton = document.querySelector("#date-form__submit");
submitButton.addEventListener("click", (event) => (getPhotos(event)));

getManifest();

async function getManifest() {  

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

  // If form input is valid, prevent default form behavior
  // else allow default form behavior (required fields, etc), then early exit this function
  if (form.checkValidity()){
    event.preventDefault();
  } else {
    return;
  }
  


  // Build fetch URL
  let urlPrefix = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=";
  let date = datePicker.value;
  let urlSuffix = "&api_key=DEMO_KEY";
  let fetchURL = new URL(urlPrefix + date + urlSuffix);  

  // Fetch 
  let output = await fetch(fetchURL).then(response => response.json()).then(data => data);
  console.log(output);
  

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
  
  let resultView = document.querySelector(".results");
  let list = document.createElement('ul');
  
  
  photoArray.forEach((value, index) => {

    let listData = document.createElement('span');
    listData.innerHTML = `${value.camera} - <a href=${value.img}>${index}</a>`;
    let listEntry = document.createElement('li');
    listEntry.appendChild(listData);
    list.appendChild(listEntry);
    
  });

  resultView.appendChild(list);


}