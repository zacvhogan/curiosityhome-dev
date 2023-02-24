// set Canvas size
/// update on window resize

// Generate stars

// Generate milky way - add to stars array

// Render and animate stars

let canvas = document.querySelector("canvas");
let context = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let numStars = (canvas.height * canvas.width) / 400;
let starsArray = [];

generateStars(numStars);
//generateMilkyWay(numStars);
renderStars(starsArray);

setInterval(animateStars, 50);

function generateStars(numStars) {

	for(let i = 0; i < numStars; i++){
  	let x = Math.random() * window.innerWidth;
    let y = Math.random() * window.innerHeight;
    let size = Math.random() * 2;
    let color = [Math.random() * (420 - 240) + 240, 100, 100];
     
    starsArray.push([x, y, size, color]);
  }
}

function generateMilkyWay(numStars){

	for(let i = 0; i < numStars; i++){
    let x = Math.random() * (window.innerWidth/2 - 500) + 500;
      let y = Math.random() * (window.innerHeight/2 - 100) + 100;
  let size = Math.random() * 2;
  let color = 'blue';
    starsArray.push([x, y, size, color]);
    }
}

function renderStars(starsArray){

	// Clear previous frame
	context.clearRect(0, 0, window.innerWidth, window.innerHeight);

	starsArray.forEach(element => {    
  	// Colour randomisation - in what format??
  	//context.fillStyle = `hsl(${element[3][0]},${element[3][1]},${element[3][2]})`;    
    context.fillStyle = "white";
    let dimChance = Math.random() * 100;
    if (dimChance < 1){
    	context.fillStyle="silver";
    }
    context.fillRect(element[0], element[1], element[2], element[2]);  
  });  
}

function animateStars() {	
  
  // Generate new frame
 	// Set new stars location
  starsArray.forEach(element => {
  	element[0] = element[0] + 0.5;
    element[1] = element[1] + 0.1;  
    
    if (element[0] > window.innerWidth){
    	element[0] = 0;    	
    }
    if (element[1] > window.innerHeight){
    	element[1] = 0;    	
    }
  });
  
  // Render
  renderStars(starsArray);
  

}