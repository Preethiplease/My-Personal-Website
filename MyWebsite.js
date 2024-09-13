document.addEventListener("DOMContentLoaded", function () {
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-placeholder").innerHTML = data;
            adjustLayout();
            // Initialize the header scripts after the header is loaded
            initializeHeaderScripts();  // This function is in your main JS file
        })
        .catch(error => console.log('Error loading header:', error));
        console.log("DOM fully loaded and parsed");

        const canvas = document.getElementById('gameCanvas');
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Failed to get 2D context from canvas');
            return;
        }

        const box = 20; // Reduced size of one box to make more boxes in the grid
        canvas.width = 40 * box; // Canvas width (1000px)
        canvas.height = 25 * box; // Canvas height (500px)

        // Initialize variables
        let snake = []; // Snake array
        let food;
        let score;
        let direction = null;
        let nextDirection = null;
        let gameInterval;
        let gameOver = false; // Flag to track if the game is over

        // Initialize game
        function initGame() {
            console.log("Initializing game...");
            snake = [{ x: 20 * box, y: 12 * box }]; // Start the snake near the center (adjusted for new size)
            food = {
                x: Math.floor(Math.random() * 40) * box,
                y: Math.floor(Math.random() * 25) * box
            };
            score = 0;
            direction = null;
            nextDirection = null;
            gameOver = false;
            clearInterval(gameInterval);
            gameInterval = setInterval(draw, 100);
            document.getElementById('score').innerText = `Score: ${score}`;
        }

        // Debug: check if the event listener for keydown works
        // Updated keydown event listener
        document.addEventListener('keydown', function(event) {
            const activeElement = document.activeElement;

            // Check if the active element is an input or textarea, and allow normal behavior
            if (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA") {
                return; // Allow default behavior for form input fields
            }

            // Prevent default behavior for game control keys
            event.preventDefault();
            console.log("Key pressed:", event.keyCode);

            // Prevent moving in the opposite direction
            if (event.keyCode === 37 && direction !== 'RIGHT') { // LEFT arrow
                nextDirection = 'LEFT';
            } else if (event.keyCode === 38 && direction !== 'DOWN') { // UP arrow
                nextDirection = 'UP';
            } else if (event.keyCode === 39 && direction !== 'LEFT') { // RIGHT arrow
                nextDirection = 'RIGHT';
            } else if (event.keyCode === 40 && direction !== 'UP') { // DOWN arrow
                nextDirection = 'DOWN';
            }
        });


        function draw() {
            if (gameOver) {
                displayGameOver(); // Display game over message inside the canvas
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Apply the next direction after drawing to ensure smooth changes
            if (nextDirection) {
                direction = nextDirection;
                nextDirection = null;
            }

            // Draw the snake
            for (let i = 0; i < snake.length; i++) {
                ctx.fillStyle = (i === 0) ? 'darkgreen' : 'Green';
                ctx.fillRect(snake[i].x, snake[i].y, box, box);
                ctx.strokeStyle = 'black';
                ctx.strokeRect(snake[i].x, snake[i].y, box, box);
            }

            // Draw the food
            ctx.fillStyle = '#800000';
            ctx.fillRect(food.x, food.y, box, box);

            // Move the snake
            let snakeX = snake[0].x;
            let snakeY = snake[0].y;

            if (direction === 'LEFT') snakeX -= box;
            if (direction === 'UP') snakeY -= box;
            if (direction === 'RIGHT') snakeX += box;
            if (direction === 'DOWN') snakeY += box;

            // Check if snake eats the food
            if (snakeX === food.x && snakeY === food.y) {
                score++;
                food = {
                    x: Math.floor(Math.random() * 40) * box,
                    y: Math.floor(Math.random() * 25) * box
                };
            } else {
                snake.pop(); // Remove the tail
            }

            let newHead = { x: snakeX, y: snakeY };

            // Check for collisions with walls or self
            if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
                gameOver = true;
                clearInterval(gameInterval);
                displayGameOver(); // Call the function to show game over message
                return;
            }

            snake.unshift(newHead);
            document.getElementById('score').innerText = `Score: ${score}`;
        }

        function collision(head, array) {
            for (let i = 0; i < array.length; i++) {
                if (head.x === array[i].x && head.y === array[i].y) {
                    return true;
                }
            }
            return false;
        }

        // Display game over message inside the canvas
        function displayGameOver() {
            console.log("Game over - displaying message");
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';  // Slightly transparent background
            ctx.fillRect(0, canvas.height / 3, canvas.width, canvas.height / 3);  // Draw a box in the middle

            ctx.fillStyle = 'white';  // Text color
            ctx.font = '30px Times New Roman';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);
            ctx.font = '15px Arial';
            ctx.fillText('Click restart to play again', canvas.width / 2, canvas.height / 2 + 20);
        }

        document.getElementById('resetButton').addEventListener('click', function() {
            console.log("Reset button clicked");
            initGame(); // Resets the game without reloading the page
        });

        // Start the game
        initGame();



// --- Sandbox Logic ---
 const sandboxCanvas = document.getElementById('sandboxCanvas');
 const sandboxCtx = sandboxCanvas ? sandboxCanvas.getContext('2d') : null;

 if (!sandboxCtx) {
     console.error('Failed to get 2D context from sandbox canvas');
     return;
 }

 const particlesArray = [];
 const numberOfParticles = 5000;  // Doubled the particle count
 let mouseX = -100, mouseY = -100; // Initialize mouse offscreen

 sandboxCanvas.addEventListener('mousemove', (e) => {
     mouseX = e.offsetX;
     mouseY = e.offsetY;
 });

 class Particle {
     constructor(x, y, size, color, speedX, speedY) {
         this.x = x;
         this.y = y;
         this.size = size;
         this.color = color;
         this.speedX = speedX;
         this.speedY = speedY;
     }
     drawStar(cx, cy, spikes, outerRadius, innerRadius) {
         let rot = Math.PI / 2 * 3;
         let x = cx;
         let y = cy;
         const step = Math.PI / spikes;

         sandboxCtx.beginPath();
         sandboxCtx.moveTo(cx, cy - outerRadius);
         for (let i = 0; i < spikes; i++) {
             x = cx + Math.cos(rot) * outerRadius;
             y = cy + Math.sin(rot) * outerRadius;
             sandboxCtx.lineTo(x, y);
             rot += step;

             x = cx + Math.cos(rot) * innerRadius;
             y = cy + Math.sin(rot) * innerRadius;
             sandboxCtx.lineTo(x, y);
             rot += step;
         }
         sandboxCtx.lineTo(cx, cy - outerRadius);
         sandboxCtx.closePath();
         sandboxCtx.fillStyle = this.color;
         sandboxCtx.fill();
     }

     // Call this.drawStar inside draw method
     draw() {
         this.drawStar(this.x, this.y, 5, this.size, this.size / 2);  // 5 spikes star
     }

     // draw() {
     //     sandboxCtx.beginPath();
     //     sandboxCtx.drawStar(this.x, this.y, this.size, 0, Math.PI * 2);
     //     sandboxCtx.fillStyle = this.color;
     //     sandboxCtx.fill();
     // }

     update() {
         const dx = mouseX - this.x;
         const dy = mouseY - this.y;
         const distance = Math.sqrt(dx * dx + dy * dy);

         if (distance < 100) {
             const angle = Math.atan2(dy, dx);
             const repellentForce = 0.1;
             this.speedX -= Math.cos(angle) * repellentForce;
             this.speedY -= Math.sin(angle) * repellentForce;
         }

         this.x += this.speedX;
         this.y += this.speedY;

         if (this.x - this.size < 0 || this.x + this.size > sandboxCanvas.width) {
             this.speedX *= -1;
         }
         if (this.y - this.size < 0 || this.y + this.size > sandboxCanvas.height) {
             this.speedY *= -1;
         }
     }
 }

 function initParticles() {
     particlesArray.length = 0;
     for (let i = 0; i < numberOfParticles; i++) {
         const size = Math.random() * 3 + 2;
         const x = Math.random() * (sandboxCanvas.width - size * 2) + size;
         const y = Math.random() * (sandboxCanvas.height - size * 2) + size;
         const speedX = (Math.random() * 1) - 0.5;
         const speedY = (Math.random() * 1) - 0.5;
         const color = '#F3CFC6';  // Set particles color to pink
         particlesArray.push(new Particle(x, y, size, color, speedX, speedY));
     }
 }

 function animate() {
     sandboxCtx.clearRect(0, 0, sandboxCanvas.width, sandboxCanvas.height);
     sandboxCtx.fillStyle = 'black';  // Set canvas background to black
     sandboxCtx.fillRect(0, 0, sandboxCanvas.width, sandboxCanvas.height);

     particlesArray.forEach(particle => {
         particle.draw();
         particle.update();
     });

     requestAnimationFrame(animate);
 }

 initParticles(); // Initialize particles
 animate(); // Start animation

});


function initializeHeaderScripts() {
  const modal = document.getElementById("contactForm");
 const btn = document.querySelector(".fa-envelope");
 const span = document.querySelector(".close-btn");
 const form = document.getElementById("contact-form");
 const thankYouMessage = document.getElementById("thank-you-message");


 if (btn) {
     btn.onclick = function (event) {
         event.preventDefault();
         modal.style.display = "block";
         console.log("Email button clicked - modal opened.");
     };
 } else {
     console.error("Email button not found.");
 }

 if (span) {
     span.onclick = function () {
         modal.style.display = "none";
         console.log("Close button clicked - modal closed.");
     };
 } else {
     console.error("Close button not found.");
 }

 window.onclick = function (event) {
     if (event.target == modal) {
         modal.style.display = "none";
         console.log("Click outside modal detected - modal closed.");
     }
 };

 // Form submission with reCAPTCHA
 if (form) {
     form.addEventListener("submit", function (event) {
         event.preventDefault(); // Prevent page refresh

         const submitButton = form.querySelector('button.g-recaptcha');
         if (submitButton) {
             submitButton.classList.add('loading'); // Apply loading state
             submitButton.disabled = true; // Disable the button
         }

         console.log("Form submission initiated...");

         const formData = new FormData(form);
         for (let [key, value] of formData.entries()) {
             console.log(`FormData: ${key} = ${value}`);
         }

         fetch(form.action, {
             method: "POST",
             body: formData,
         })
             .then(response => {
                 console.log("Response received from the server.");
                 if (response.ok) {
                     console.log("Form submission successful, displaying thank-you message.");
                     return response.text(); // Get response text
                 } else {
                     console.error("Form submission failed with status:", response.status);
                     throw new Error("Form submission failed with status: " + response.status);
                 }
             })
             .then(text => {
                 console.log("Server response text:", text);
                 form.style.display = "none";
                 thankYouMessage.style.display = "block";

                 setTimeout(function () {
                     modal.style.display = "none";
                     form.reset();
                     form.style.display = "block";
                     thankYouMessage.style.display = "none";

                     if (submitButton) {
                         submitButton.classList.remove('loading'); // Remove loading state
                         submitButton.disabled = false; // Enable the button
                     }

                     console.log("Modal closed after 3 seconds.");
                 }, 5000); // 5 seconds
             })
             .catch(error => {
                 console.error("Error during form submission:", error);
                 if (submitButton) {
                     submitButton.classList.remove('loading'); // Remove loading state
                     submitButton.disabled = false; // Enable the button
                 }
             });
     });
 } else {
     console.error("Contact form not found.");
 }




// Side menu logic
const menuButton = document.querySelector(".menu-button");
const sideMenu = document.querySelector(".side-menu");
const closeBtn = document.querySelector(".side-menu .close-btnn");

if (menuButton && sideMenu) {
  menuButton.addEventListener("click", function() {
    console.log("Menu button clicked.");
    sideMenu.classList.toggle("open");
  });
} else {
  console.error("Menu button or side menu not found.");
}

if (closeBtn) {
  closeBtn.addEventListener("click", function() {
    console.log("Close button for side menu clicked.");
    sideMenu.classList.remove("open");
  });
} else {
  console.error("Close button for side menu not found.");
}

// Close the side menu when the user clicks outside of it
window.addEventListener("click", function(event) {
  if (sideMenu.classList.contains("open") && !sideMenu.contains(event.target) && !menuButton.contains(event.target)) {
    console.log("Click detected outside side Menu. Closing side menu.");
    sideMenu.classList.remove("open");
  }
});

}


function scaleContent() {
const header = document.querySelector('#header-placeholder'); // Reference to the header
const bodyContent = document.querySelector('.body-content'); // Reference to the body content wrapper
const html = document.documentElement;

// Get the dimensions of the viewport
const width = window.innerWidth;

// Calculate the scale factor for the width
const scaleX = width / html.scrollWidth;

// Apply the scale transformation based on width
header.style.transform = `scale(${scaleX})`;
header.style.transformOrigin = 'top left';
bodyContent.style.transform = `scale(${scaleX})`;
bodyContent.style.transformOrigin = 'top left';

// Adjust the widths to fit within the viewport
header.style.width = `${width / scaleX}px`;
bodyContent.style.width = `${width / scaleX}px`;
bodyContent.style.height = 'auto'; // Let the height adjust automatically
}

function resetScale() {
const header = document.querySelector('#header-placeholder'); // Reference to the header
const bodyContent = document.querySelector('.body-content'); // Reference to the body content wrapper
header.style.transform = 'none';
header.style.width = '100%'; // Reset width to 100%
bodyContent.style.transform = 'none';
bodyContent.style.width = '100%'; // Reset width to 100%
bodyContent.style.height = 'auto'; // Reset height to auto
}

function adjustLayout() {
resetScale();
requestAnimationFrame(scaleContent);
}

// Initial scale on page load
document.addEventListener('DOMContentLoaded', adjustLayout);
// Rescale on window resize
window.addEventListener('resize', adjustLayout);
