/* ============================================================
   Kelechi Studio — site scripts
   - mobile navigation toggle
   - booking demo (builds a WhatsApp message)
   - hours table "today" highlight
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // close the menu after tapping a link on small screens
    links.addEventListener("click", function (e) {
      if (e.target.closest("a") && window.innerWidth <= 760) {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Booking demo ----------
     Picks up the form values and opens WhatsApp with a
     pre-filled message. On a live site you only need to
     change the number below. */
  var bookingForm = document.querySelector("#booking-form");
  var results = document.querySelector("#booking-summary");
  var WHATSAPP_NUMBER = "2348000000000"; // demo number

  function fmtNaira(n) {
    return "\u20A6" + Number(n || 0).toLocaleString("en-NG");
  }

  if (bookingForm) {
    var serviceSelect = bookingForm.querySelector("#bk-service");
    var daySelect = bookingForm.querySelector("#bk-day");
    var chips = bookingForm.querySelectorAll('input[name="bk-time"]');
    var nameField = bookingForm.querySelector("#bk-name");

    function selectedTime() {
      for (var i = 0; i < chips.length; i++) {
        if (chips[i].checked) return chips[i].value;
      }
      return null;
    }

    function update() {
      if (!results) return;
      var service = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex] : null;
      var day = daySelect ? daySelect.options[daySelect.selectedIndex] : null;
      var time = selectedTime();
      var name = nameField ? nameField.value.trim() : "";

      var price = service && service.dataset && service.dataset.price ? service.dataset.price : "0";
      var serviceLabel = service && service.value ? service.value : null;
      var dayLabel = day && day.value ? day.value : null;

      if (serviceLabel && dayLabel && time) {
        var summary =
          "Service: " + serviceLabel + " (" + fmtNaira(price) + ")\n" +
          "Day: " + dayLabel + "\n" +
          "Time: " + time + "\n" +
          (name ? "Name: " + name + "\n" : "");
        results.textContent = summary;
        results.hidden = false;
      } else {
        results.hidden = true;
      }
    }

    if (serviceSelect) serviceSelect.addEventListener("change", update);
    if (daySelect) daySelect.addEventListener("change", update);
    chips.forEach(function (c) { c.addEventListener("change", update); });
    if (nameField) nameField.addEventListener("input", update);

    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var service = serviceSelect.value;
      var day = daySelect.value;
      var time = selectedTime();
      var name = nameField.value.trim();

      if (!service || !day || !time) {
        alert("Pick a service, a day and a time first \u2014 then we\u2019ll take it from there.");
        return;
      }

      var message =
        "Hello Kelechi Studio! I\u2019d like to book:" +
        "\n\u2022 " + service +
        "\n\u2022 " + day + " at " + time +
        (name ? "\n\u2022 Name: " + name : "");

      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
      window.open(url, "_blank", "noopener");
    });
  }

  /* ---------- Hours: highlight today ---------- */
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var today = days[new Date().getDay()];
  var rows = document.querySelectorAll(".hours-table tr[data-day]");
  rows.forEach(function (row) {
    if (row.getAttribute("data-day") === today) row.classList.add("is-today");
  });

  /* ---------- Footer year ---------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();