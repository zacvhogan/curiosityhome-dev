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

getManifest();

async function getManifest() {  

  // TODO: Show loading anim

  // Fetch  manfest
  manifest =  await fetch("https://api.nasa.gov/mars-photos/api/v1/manifests/Curiosity?api_key=" + API_KEY)
  .then(response => response.json())
  .then(data => data);

  console.log("Total photos since mission start: " + manifest.photo_manifest.total_photos);
  

  // Page setup 
  // Set date limits using manifest data
  datePicker.min =  "2012-08-06";
  datePicker.max = manifest.photo_manifest.max_date;


  // Show page  
  app.animate([
    {opacity: 0},
    {opacity: 1}
  ],
  {duration: 500, fill: "forwards"});


}