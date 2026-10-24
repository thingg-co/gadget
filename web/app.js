// Gadget product page. Light touch: reveal on scroll, subtle phone tilt,
// waitlist form with a pluggable endpoint.

(function () {
  "use strict";

  // Point this at a real endpoint when one exists. Until then the form
  // falls back to a friendly message.
  var WAITLIST_ENDPOINT = "/api/waitlist";
  var FALLBACK_MSG = "The waitlist opens when the site goes live. Check back here.";

  // ---- Reveal on scroll -------------------------------------------------
  var revealables = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );
    revealables.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 90 + "ms";
      io.observe(el);
    });
  } else {
    revealables.forEach(function (el) { el.classList.add("in"); });
  }

  // ---- Subtle phone tilt on scroll -------------------------------------
  var phone = document.getElementById("heroPhone");

  if (phone) {
    var ticking = false;

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var y = window.scrollY;
          var t = Math.min(1, y / 700);
          phone.style.transform = "rotate(" + (2 - t * 4).toFixed(2) + "deg)";
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ---- Waitlist form ----------------------------------------------------
  var form = document.getElementById("waitlist");
  var status = document.getElementById("waitlistStatus");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var email = document.getElementById("email").value.trim();

      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        status.textContent = "That address does not look right. Try again.";
        return;
      }

      var done = function (msg) { status.textContent = msg; form.reset(); };

      fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      })
        .then(function (res) {
          if (res.ok) done("You are on the list. We will write when Gadget ships.");
          else done(FALLBACK_MSG);
        })
        .catch(function () { done(FALLBACK_MSG); });
    });
  }
})();
