document.addEventListener("DOMContentLoaded", function() {

  // check to see if its got touch
    if ('ontouchstart' in window) {
      console.log("Touch events supported.");
    } else {
      console.log("Touch events not supported.");
    }  // check to see if its got touch ends here


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

    // start of slider script, it is inside the dom function to be loaded on time
    // Initialize the main slider
    var slideIndex = 1;
    showSlides(slideIndex);

    // Make the slider functions globally accessible
    window.plusSlides = function(n) {
        showSlides(slideIndex += n);
    };

    window.currentSlide = function(n) {
        showSlides(slideIndex = n);
    };

    function showSlides(n) {
        var i;
        var slides = document.getElementsByClassName("mySlides");
        var dots = document.getElementsByClassName("dot");

        if (n > slides.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }

        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  // Hide all slides
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }

        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].className += " active"; // Ensure the active class is added

        console.log("Active dot:", dots[slideIndex - 1]); // Log the active dot for debugging
    }

    // start of img slider
    initializeSliders();

    function initializeSliders() {
    console.log("Initializing image sliders...");

    const sliders = document.querySelectorAll('.project_imageslideshow');
    console.log("Found sliders: ", sliders.length);

    sliders.forEach((slider, index) => {
        const sliderId = index + 1; // Assign a unique ID to each slider
        let ImgslideIndex = 1;
        showImgSlides(ImgslideIndex, sliderId); // Initialize each slider

        // Make the slider functions globally accessible
        window.ImgplusSlides = function(n, sliderId) {
            console.log(`Moving to next slide in slider ${sliderId}`);
            showImgSlides(ImgslideIndex += n, sliderId);
        };

        window.ImgcurrentSlide = function(n, sliderId) {
            console.log(`Moving to slide ${n} in slider ${sliderId}`);
            showImgSlides(ImgslideIndex = n, sliderId);
        };

        // Swipe functionality
        let touchStartX = 0;
        let touchEndX = 0;

        slider.addEventListener('touchstart', function(event) {
            touchStartX = event.changedTouches[0].clientX; // Capture the starting X position
            console.log("Touch started at: " + touchStartX);
        });

        slider.addEventListener('touchmove', function(event) {
            touchEndX = event.changedTouches[0].clientX; // Capture the X position during the swipe
            console.log("Touch moved to: " + touchEndX);
        });

        slider.addEventListener('touchend', function() {
            console.log("Touch ended at: " + touchEndX);
            handleSwipe(sliderId); // Handle the swipe action when touch ends
        });

        function handleSwipe(sliderId) {
            if (touchEndX < touchStartX - 50) {
                // Swipe left detected (50px threshold to avoid small accidental movements)
                console.log(`Swipe left detected on slider ${sliderId}`);
                ImgplusSlides(1, sliderId); // Move to the next slide
            } else if (touchEndX > touchStartX + 50) {
                // Swipe right detected
                console.log(`Swipe right detected on slider ${sliderId}`);
                ImgplusSlides(-1, sliderId); // Move to the previous slide
            }
        }

        function showImgSlides(n, sliderId) {
            let i;
            let Imgslides = document.querySelectorAll(`.myImgSlides[data-slider-id="${sliderId}"]`);
            let Imgdots = document.querySelectorAll(`.Imgdot-container[data-slider-id="${sliderId}"] .Imgdot`);

            if (n > Imgslides.length) { ImgslideIndex = 1; }
            if (n < 1) { ImgslideIndex = Imgslides.length; }

            for (i = 0; i < Imgslides.length; i++) {
                Imgslides[i].style.display = "none"; // Hide all slides
            }

            if (Imgdots.length > 0) {
                for (i = 0; i < Imgdots.length; i++) {
                    Imgdots[i].className = Imgdots[i].className.replace(" Imgactive", "");
                }
                Imgdots[ImgslideIndex - 1].className += " Imgactive"; // Add the Imgactive class
            }

            Imgslides[ImgslideIndex - 1].style.display = "block"; // Show the current slide
        }
    });
}

}); // end of calling DOM


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
