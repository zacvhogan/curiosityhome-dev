let canvas = document.querySelector("canvas");
let context = canvas.getContext("2d");
// Using screen dimensions instead of viewport
// This gives a much larger canvas that should not result
// in the stars hitting canvas borders prematurely and creating artifacts.
// Simple solution, removes need to additional logic.
// TODO: Edge case - page opened on browser window on lower resolution monitor
// then moved to higher resolution monitor results in canvas too small.
let winWidth = window.screen.width;
let winHeight = window.screen.height;
console.log(window.screen.availWidth);

canvas.height = winHeight;
canvas.width = winWidth;


let numStars = Math.round((winHeight * winWidth) / 4000);
let starsArray = [];

generateStars(numStars);
renderStars(starsArray);

setInterval(animateStars, 50);

function generateStars(numStars) {

  for (let i = 0; i < numStars; i++) {

    let maxSize = 8;
    let x = Math.random() * winWidth;
    let y = Math.random() * winHeight;
    let size = Math.random() * maxSize;
    let color = `hsl(${Math.round(Math.random() * (340 - 180) + 180)} 100% 85%)`;
    //console.log(color);


    starsArray.push([x, y, size, color, maxSize]);
  }
}
console.log(starsArray[0][3]);




function renderStars(starsArray) {



  // Clear previous frame
  context.clearRect(0, 0, winWidth, winHeight);


 
  starsArray.forEach(element => {
    context.fillStyle = element[3];
    let x = element[0];
    let y = element[1];
    let size = element[2];
    let maxSize = element[4];

    let dimChance = Math.random() * 100;    
    if (dimChance < 050 && size < maxSize * 0.2) {
      context.fillStyle = "white";
    }   
    

    context.beginPath();
    context.arc(x - size, y - size, size, 0, 0.5 * Math.PI);
    context.arc(x - size, y + size, size, 1.5 * Math.PI, 2 * Math.PI);
    context.arc(x + size, y + size, size, 1 * Math.PI, 1.5 * Math.PI);
    context.arc(x + size, y - size, size, 0.5 * Math.PI, 1 * Math.PI);   
    context.fill();
    
    //context.fillRect(element[0], element[1], element[2], element[2]);

  });
}


function animateStars() {

  // Generate new frame
  // Set new stars location
  starsArray.forEach(element => {
    element[0] = element[0] - 0.5;
    element[1] = element[1] + 0.1;

    if (element[0] < 0) {
      element[0] = winWidth;
    element[0] = element[0] - 0.5;
    element[1] = element[1] + 0.1;
    }

    if (element[0] < 0) {
      element[0] = winWidth;
    }
    if (element[1] > winHeight) {
      element[1] = 0;
    }
  });

  // Render
  renderStars(starsArray);
}



