document.addEventListener("DOMContentLoaded", function() {
  const menuIcon = document.getElementById("menuIcon");
  const navLinks = document.getElementById("navLinks");
  const closeIcon = document.getElementById("closeIcon");
  const sponsorBtn = document.querySelector(".sponsor-btn");
  const MOBILE_BREAKPOINT = 970;

  // Ensure Events nav link exists across pages
  function ensureEventsLink() {
    if (!navLinks) return;
    const existing = navLinks.querySelector('a.nav-link[href$="events/events.html"], a.nav-link[href$="events.html"]');
    if (existing) return;
    const eventsLink = document.createElement('a');
    eventsLink.href = (window.location.pathname.includes('/events/') ? './events.html' : 'events/events.html');
    eventsLink.className = 'nav-link';
    eventsLink.textContent = 'Events';
    // Place between Videos and Our Mission
    const videosLink = navLinks.querySelector('a.nav-link[href$="video/videos.html"]');
    const ourMissionLink = navLinks.querySelector('a.nav-link[href$="our_mission/our_mission.html"]');
    if (ourMissionLink) {
      navLinks.insertBefore(eventsLink, ourMissionLink);
    } else if (videosLink && videosLink.nextSibling) {
      navLinks.insertBefore(eventsLink, videosLink.nextSibling);
    } else if (sponsorBtn && sponsorBtn.parentElement === navLinks) {
      navLinks.insertBefore(eventsLink, sponsorBtn);
    } else {
      navLinks.appendChild(eventsLink);
    }
  }

  // Move sponsor button to bottom in mobile view
  function adjustSponsorButton() {
    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      navLinks.appendChild(sponsorBtn);
    } else {
      // Insert before team dropdown for desktop
      const teamDropdown = document.querySelector(".team-dropdown");
      navLinks.insertBefore(sponsorBtn, teamDropdown.nextSibling);
    }
  }

  // Toggle mobile menu
  function toggleMobileMenu(open) {
    if (open) {
      navLinks.classList.add("active");
      menuIcon.classList.add("hide");
      document.body.classList.add("no-scroll");
      
      // Add smooth opening animation
      requestAnimationFrame(() => {
        navLinks.style.animation = 'slideInRight 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
      });
    } else {
      // Add smooth closing animation
      navLinks.style.animation = 'slideOutRight 0.25s cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards';
      
      setTimeout(() => {
        navLinks.classList.remove("active");
        navLinks.style.animation = '';
        menuIcon.classList.remove("hide");
        document.body.classList.remove("no-scroll");
      }, 250);
    }
  }


  // Initialize
  adjustSponsorButton();
  ensureEventsLink();

  // Event listeners
  menuIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMobileMenu(true);
  });
  
  closeIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMobileMenu(false);
  });
  
  // Close menu when clicking outside
  document.addEventListener("click", function(e) {
    if (navLinks.classList.contains("active") && 
        !navLinks.contains(e.target) && 
        !menuIcon.contains(e.target)) {
      toggleMobileMenu(false);
    }
  });
  
  // Close menu when pressing escape key
  document.addEventListener("keydown", function(e) {
    if (e.key === 'Escape' && navLinks.classList.contains("active")) {
      toggleMobileMenu(false);
    }
  });
  
  // Prevent body scroll when menu is open
  document.addEventListener("touchmove", function(e) {
    if (navLinks.classList.contains("active")) {
      e.preventDefault();
    }
  }, { passive: false });
  
  // Optimize resize handling with debouncing
  let resizeTimeout;
  window.addEventListener("resize", function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      adjustSponsorButton();
      ensureEventsLink();
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        toggleMobileMenu(false);
      }
    }, 100);
  });


});