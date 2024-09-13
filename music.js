document.addEventListener("DOMContentLoaded", function() {
  // Load the header content
  fetch("header.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("header-placeholder").innerHTML = data;
      // Initial scale on page load
      adjustLayout();
      // Initialize the header scripts after the header is loaded
      initializeHeaderScripts();  // This function is in your main JS file
  })
  .catch(error => console.log('Error loading header:', error));

  console.log("DOM fully loaded and parsed");

  // Video controls for pausing other videos and resetting on pause or end
  const videos = document.querySelectorAll('video');

  videos.forEach(function(video) {
    // Pause all other videos when one is played
    video.addEventListener('play', function() {
      videos.forEach(function(otherVideo) {
        if (otherVideo !== video && !otherVideo.paused) {
          otherVideo.pause();
          otherVideo.currentTime = 0; // Reset other video to start
        }
      });
    });

    // Reset video to start and show poster when paused
    video.addEventListener('pause', function() {
      if (!video.ended) {
        video.currentTime = 0; // Reset to start
        video.load();
      }
    });

    // When video ends, reset to start
    video.addEventListener('ended', function() {
      video.currentTime = 0; // Reset to start
      video.load();
    });
  });

  // Slider functionality
  const _C = document.querySelector('.container'),
        N = _C.children.length;

  _C.style.setProperty('--n', N);
  _C.addEventListener('touchmove', e => { e.preventDefault() }, false);

  let x0 = null;
  let w = window.innerWidth;  // Initialize 'w' with the window width
  let i = 0;

  function unify(e) {
    return e.changedTouches ? e.changedTouches[0] : e;
  }

  let locked = false;

  function lock(e) {
    x0 = unify(e).clientX;
    locked = true;
    _C.classList.toggle('smooth', false); // Turn off smooth transition during drag
  }

  function drag(e) {
    e.preventDefault();
    if (locked) {
      let dx = unify(e).clientX - x0;
      let f = +(dx / w).toFixed(2);
      _C.style.setProperty('--i', i - f);
    }
  }

  function move(e) {
    if (locked) {
      let dx = unify(e).clientX - x0;
      let s = Math.sign(dx);
      let f = +(s * dx / w).toFixed(2);

      if ((i > 0 || s < 0) && (i < N - 1 || s > 0) && f > .2) {
        _C.style.setProperty('--i', i -= s);
        f = 1 - f;
      }

      _C.style.setProperty('--tx', '0px');
      _C.style.setProperty('--f', f);
      _C.classList.toggle('smooth', true); // Turn on smooth transition after drag ends
      locked = false;
      x0 = null;
    }
  }

  function size() {
    w = window.innerWidth; // Recalculate window width on resize
  }

  // Event listeners for drag and touch events
  _C.addEventListener('mousemove', drag, false);
  _C.addEventListener('touchmove', drag, false);

  _C.addEventListener('mousedown', lock, false);
  _C.addEventListener('touchstart', lock, false);

  _C.addEventListener('mouseup', move, false);
  _C.addEventListener('touchend', move, false);

  // Recalculate size on window resize
  window.addEventListener('resize', size);

  // Adjust layout when the window is resized
  window.addEventListener('resize', adjustLayout);


}); //End of DOM

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

} //end of initialise headerscripts


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
