document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.getElementById("menuIcon");
  const navLinks = document.getElementById("navLinks");
  const closeIcon = document.getElementById("closeIcon");
  const teamDropdownBtn = document.getElementById("teamDropdownBtn");
  const teamDropdownContent = document.querySelector(".team-dropdown-content");
  const competitionDropdownBtn = document.getElementById("competitionDropdownBtn");
  const competitionDropdownContent = document.querySelector(".competition-dropdown-content");
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

  // Ensure Team -> Assets link exists with correct relative path
  function ensureAssetsLink() {
    if (!teamDropdownContent) return;
    const existing = teamDropdownContent.querySelector('a.dropdown-link[href$="assets.html"]');
    if (existing) return;

    function computeAssetsHref() {
      const path = window.location.pathname.replace(/\\+/g, '/');
      // Normalize to forward slashes and lower-case comparison where useful
      if (path.endsWith('/index.html') || path === '/' || path === '') {
        return 'team/assets.html';
      }
      // Under team root pages like /team/member.html
      if (/\/team\//.test(path)) {
        // If inside /team/competition/*, go up one level
        if (/\/team\/competition\//.test(path)) {
          return '../assets.html';
        }
        return 'assets.html';
      }
      // For other section pages in subfolders (e.g., /projects/*, /competition/*, /video/*, /advisors/*, etc.)
      return '../team/assets.html';
    }

    const assetsLink = document.createElement('a');
    assetsLink.href = computeAssetsHref();
    assetsLink.className = 'dropdown-link';
    assetsLink.textContent = 'Assets';
    teamDropdownContent.appendChild(assetsLink);
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
      // Add open class for CSS transition
      navLinks.classList.add("open");
    } else {
      navLinks.classList.remove("active");
      menuIcon.classList.remove("hide");
      document.body.classList.remove("no-scroll");
      navLinks.classList.remove("open");

      // Close all dropdowns when closing menu
      document.querySelectorAll('.dropdown-content, .team-dropdown-content, .competition-dropdown-content').forEach(content => {
        content.classList.remove("mobile-open");
      });
    }
  }

  // Initialize
  adjustSponsorButton();
  ensureEventsLink();
  ensureAssetsLink();

  // Event listeners
  menuIcon.addEventListener("click", () => toggleMobileMenu(true));
  closeIcon.addEventListener("click", () => toggleMobileMenu(false));

  document.addEventListener("click", function (e) {
    if (navLinks.classList.contains("active") &&
      !navLinks.contains(e.target) &&
      !menuIcon.contains(e.target)) {
      toggleMobileMenu(false);
    }
  });

  // Mobile Dropdown Logic
  function setupMobileDropdown(btn, content) {
    if (!btn || !content) return;

    btn.addEventListener("click", function (e) {
      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        e.preventDefault();
        e.stopPropagation();

        // Close other dropdowns
        const allContents = document.querySelectorAll('.team-dropdown-content, .competition-dropdown-content');
        const allBtns = document.querySelectorAll('#teamDropdownBtn, #competitionDropdownBtn');

        allContents.forEach(c => {
          if (c !== content) c.classList.remove("mobile-open");
        });

        allBtns.forEach(b => {
          if (b !== btn) b.classList.remove("active");
        });

        content.classList.toggle("mobile-open");
        btn.classList.toggle("active");
      }
    });

    content.addEventListener("click", function (e) {
      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        e.stopPropagation();
      }
    });
  }

  setupMobileDropdown(teamDropdownBtn, teamDropdownContent);
  setupMobileDropdown(competitionDropdownBtn, competitionDropdownContent);

  window.addEventListener("resize", function () {
    adjustSponsorButton();
    ensureEventsLink();
    ensureAssetsLink();

    if (window.innerWidth > MOBILE_BREAKPOINT) {
      toggleMobileMenu(false);
      // Remove mobile specific classes
      document.querySelectorAll('.mobile-open').forEach(el => el.classList.remove('mobile-open'));
    }
  });
});