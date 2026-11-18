const SERVICES = [
  { id: "panski-strih", name: "Pánsky strih", description: "Strih nožnicami alebo strojčekom, umytie a styling.", duration: 30, price: 18 },
  { id: "strih-styling", name: "Strih, umytie a styling", description: "Strih s umytím, masážou hlavy a finálnym stylingom.", duration: 45, price: 25 },
  { id: "skin-fade", name: "Skin fade", description: "Plynulý prechod až do kože, presné kontúry.", duration: 45, price: 22 },
  { id: "strojcek", name: "Strojčekový strih", description: "Rýchly strih strojčekom na jednu dĺžku.", duration: 30, price: 12 },
  { id: "uprava-brady", name: "Úprava brady", description: "Tvarovanie brady, kontúry a ošetrenie olejom.", duration: 30, price: 14 },
  { id: "holenie-britvou", name: "Klasické holenie britvou", description: "Teplý uterák, holenie britvou a balzam.", duration: 30, price: 20 },
  { id: "strih-brada", name: "Strih a brada", description: "Kompletná úprava vlasov aj brady.", duration: 60, price: 32 },
  { id: "detsky", name: "Detský strih", description: "Strih pre chlapcov do 12 rokov.", duration: 30, price: 14 },
  { id: "kamuflaz", name: "Kamufláž sivín", description: "Prirodzené zakrytie šedín bez výrazného farbenia.", duration: 45, price: 25 },
  { id: "kralovsky", name: "Kráľovský balíček", description: "Strih, holenie britvou, maska a masáž tváre.", duration: 90, price: 55 }
];

const BARBERS = [
  {
    id: "michael",
    name: "Michael Nguyen",
    initials: "MN",
    role: "Majiteľ a barber",
    bio: "Strihá vyše desať rokov a má rád klasické strihy aj moderné fade.",
    days: [1, 2, 3, 4, 5, 6],
    services: ["panski-strih", "strih-styling", "skin-fade", "strojcek", "uprava-brady", "holenie-britvou", "strih-brada", "detsky", "kamuflaz", "kralovsky"]
  },
  {
    id: "tomas",
    name: "Tomáš Kováč",
    initials: "TK",
    role: "Barber",
    bio: "Špecialista na fade a krátke moderné strihy.",
    days: [1, 2, 3, 4, 5],
    services: ["panski-strih", "strih-styling", "skin-fade", "strojcek", "strih-brada", "detsky"]
  },
  {
    id: "lukas",
    name: "Lukáš Novák",
    initials: "LN",
    role: "Barber",
    bio: "Venuje sa brade a klasickému holeniu britvou.",
    days: [2, 3, 4, 5, 6],
    services: ["panski-strih", "uprava-brady", "holenie-britvou", "strih-brada", "kamuflaz", "kralovsky"]
  }
];

const OPENING_HOURS = [
  null,
  { open: 9 * 60, close: 19 * 60 },
  { open: 9 * 60, close: 19 * 60 },
  { open: 9 * 60, close: 19 * 60 },
  { open: 9 * 60, close: 19 * 60 },
  { open: 9 * 60, close: 19 * 60 },
  { open: 9 * 60, close: 14 * 60 }
];

const DAY_NAMES = ["nedeľa", "pondelok", "utorok", "streda", "štvrtok", "piatok", "sobota"];
const STORAGE_KEY = "barberstudio-bookings";

let selectedTime = "";

function twoDigits(number) {
  if (number < 10) {
    return "0" + number;
  }
  return "" + number;
}

function timeToMinutes(time) {
  const parts = time.split(":");
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return twoDigits(hours) + ":" + twoDigits(rest);
}

function dateToText(date) {
  return date.getFullYear() + "-" + twoDigits(date.getMonth() + 1) + "-" + twoDigits(date.getDate());
}

function todayText() {
  return dateToText(new Date());
}

function dayAfter(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return dateToText(date);
}

function dayNumber(dateText) {
  return new Date(dateText + "T00:00").getDay();
}

function prettyDate(dateText) {
  const parts = dateText.split("-");
  return DAY_NAMES[dayNumber(dateText)] + " " + parseInt(parts[2]) + ". " + parseInt(parts[1]) + ". " + parts[0];
}

function safeText(text) {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function getService(id) {
  for (const service of SERVICES) {
    if (service.id === id) {
      return service;
    }
  }
  return null;
}

function getBarber(id) {
  for (const barber of BARBERS) {
    if (barber.id === id) {
      return barber;
    }
  }
  return null;
}

function loadBookings() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === null) {
    return [];
  }
  return JSON.parse(saved);
}

function saveBookings(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function addDemoBookings() {
  if (localStorage.getItem(STORAGE_KEY) !== null) {
    return;
  }

  let days = 1;
  while (dayNumber(dayAfter(days)) === 0 || dayNumber(dayAfter(days)) === 6) {
    days++;
  }
  const date = dayAfter(days);

  const demo = [
    { id: "BS-100001", serviceId: "panski-strih", barberId: "michael", time: "10:00" },
    { id: "BS-100002", serviceId: "strih-brada", barberId: "michael", time: "14:00" },
    { id: "BS-100003", serviceId: "skin-fade", barberId: "tomas", time: "11:00" }
  ];

  const bookings = [];
  for (const item of demo) {
    bookings.push({
      id: item.id,
      serviceId: item.serviceId,
      barberId: item.barberId,
      date: date,
      time: item.time,
      name: "Demo Zákazník",
      email: "demo@example.com",
      phone: "0900 123 456",
      note: "",
      status: "potvrdená"
    });
  }
  saveBookings(bookings);
}

function isTimeFree(date, start, end, barberId) {
  const bookings = loadBookings();

  for (const booking of bookings) {
    if (booking.barberId !== barberId || booking.date !== date || booking.status !== "potvrdená") {
      continue;
    }
    const bookingStart = timeToMinutes(booking.time);
    const bookingEnd = bookingStart + getService(booking.serviceId).duration;

    if (start < bookingEnd && bookingStart < end) {
      return false;
    }
  }
  return true;
}

function getSlots(date, serviceId, barberId) {
  const service = getService(serviceId);
  const barber = getBarber(barberId);
  const day = dayNumber(date);
  const hours = OPENING_HOURS[day];
  const slots = [];

  if (hours === null || !barber.days.includes(day)) {
    return slots;
  }

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  for (let start = hours.open; start + service.duration <= hours.close; start += 30) {
    const end = start + service.duration;
    let free = isTimeFree(date, start, end, barberId);

    if (date === todayText() && start <= nowMinutes) {
      free = false;
    }

    slots.push({ time: minutesToTime(start), free: free });
  }
  return slots;
}

function showServices() {
  const list = document.getElementById("services-list");
  const select = document.getElementById("service");

  for (const service of SERVICES) {
    list.innerHTML += `
      <li class="service">
        <div>
          <h3>${service.name}</h3>
          <p>${service.description}</p>
        </div>
        <div class="service-price">
          <strong>${service.price} €</strong>
          <span>${service.duration} min</span>
        </div>
      </li>`;

    select.innerHTML += `<option value="${service.id}">${service.name} (${service.duration} min, ${service.price} €)</option>`;
  }
}

function showBarbers() {
  const list = document.getElementById("barbers-list");

  for (const barber of BARBERS) {
    let days = "";
    for (const day of barber.days) {
      if (days !== "") {
        days += ", ";
      }
      days += DAY_NAMES[day];
    }

    let services = "";
    for (const id of barber.services) {
      services += `<li>${getService(id).name}</li>`;
    }

    list.innerHTML += `
      <article class="barber">
        <div class="avatar">${barber.initials}</div>
        <h3>${barber.name}</h3>
        <p class="role">${barber.role}</p>
        <p>${barber.bio}</p>
        <p><strong>Pracuje:</strong> ${days}</p>
        <ul class="tags">${services}</ul>
      </article>`;
  }
}

function updateBarbers() {
  const serviceId = document.getElementById("service").value;
  const select = document.getElementById("barber");
  const oldValue = select.value;

  if (serviceId === "") {
    select.innerHTML = `<option value="">Najprv vyberte službu</option>`;
    return;
  }

  select.innerHTML = `<option value="">Vyberte barbera</option>`;
  for (const barber of BARBERS) {
    if (barber.services.includes(serviceId)) {
      select.innerHTML += `<option value="${barber.id}">${barber.name}</option>`;
    }
  }
  select.value = oldValue;
}

function showSlots() {
  const serviceId = document.getElementById("service").value;
  const barberId = document.getElementById("barber").value;
  const date = document.getElementById("date").value;
  const box = document.getElementById("slots");
  const info = document.getElementById("slots-info");

  box.innerHTML = "";

  if (serviceId === "" || barberId === "" || date === "") {
    selectedTime = "";
    info.textContent = "Vyberte službu, barbera a dátum.";
    showSummary();
    return;
  }

  const slots = getSlots(date, serviceId, barberId);

  let freeCount = 0;
  let selectedIsFree = false;
  for (const slot of slots) {
    if (slot.free) {
      freeCount++;
      if (slot.time === selectedTime) {
        selectedIsFree = true;
      }
    }
  }
  if (!selectedIsFree) {
    selectedTime = "";
  }

  if (slots.length === 0) {
    info.textContent = "V tento deň je zatvorené alebo barber nepracuje. Vyberte iný deň.";
  } else if (freeCount === 0) {
    info.textContent = "Tento deň je už plne obsadený. Vyberte iný deň.";
  } else {
    info.textContent = "Voľných časov: " + freeCount + ". Kliknite na čas, ktorý vám vyhovuje.";
  }

  for (const slot of slots) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "slot";
    button.textContent = slot.time;

    if (!slot.free) {
      button.disabled = true;
      button.title = "obsadené";
    }
    if (slot.time === selectedTime) {
      button.classList.add("selected");
    }

    button.addEventListener("click", function () {
      selectedTime = slot.time;
      showError("time", "");
      showSlots();
    });

    box.appendChild(button);
  }

  showSummary();
}

function showSummary() {
  const service = getService(document.getElementById("service").value);
  const barber = getBarber(document.getElementById("barber").value);
  const date = document.getElementById("date").value;
  const summary = document.getElementById("summary");

  if (service === null) {
    summary.textContent = "Zatiaľ nie je nič vybrané.";
    return;
  }

  let text = service.name + " – " + service.price + " €";
  if (barber !== null) {
    text += ", " + barber.name;
  }
  if (date !== "") {
    text += ", " + prettyDate(date);
  }
  if (selectedTime !== "") {
    text += " o " + selectedTime;
  }
  summary.textContent = text;
}

function showError(field, message) {
  document.getElementById(field + "-error").textContent = message;

  const input = document.getElementById(field);
  if (input === null) {
    return;
  }
  if (message === "") {
    input.classList.remove("invalid");
  } else {
    input.classList.add("invalid");
  }
}

function cleanPhone(phone) {
  let digits = phone.replaceAll(" ", "");
  if (digits.startsWith("+421")) {
    digits = "0" + digits.slice(4);
  }
  return digits;
}

function isValidEmail(email) {
  const at = email.indexOf("@");
  const dot = email.lastIndexOf(".");
  return at > 0 && dot > at + 1 && dot < email.length - 1 && !email.includes(" ");
}

function isValidPhone(phone) {
  const digits = cleanPhone(phone);
  return digits.length === 10 && digits.startsWith("0") && !isNaN(digits);
}

function checkForm(booking) {
  let ok = true;

  function check(field, condition, message) {
    if (condition) {
      showError(field, "");
    } else {
      showError(field, message);
      ok = false;
    }
  }

  check("service", booking.serviceId !== "", "Vyberte službu.");
  check("barber", booking.barberId !== "", "Vyberte barbera.");

  if (booking.date === "") {
    check("date", false, "Vyberte dátum.");
  } else if (booking.date < todayText()) {
    check("date", false, "Dátum nemôže byť v minulosti.");
  } else if (booking.date > dayAfter(60)) {
    check("date", false, "Rezervovať sa dá najviac 60 dní dopredu.");
  } else {
    check("date", true, "");
  }

  check("time", booking.time !== "", "Vyberte čas.");
  check("name", booking.name.length >= 3, "Zadajte meno a priezvisko.");
  check("email", isValidEmail(booking.email), "Zadajte platný e-mail.");
  check("phone", isValidPhone(booking.phone), "Zadajte telefónne číslo, napríklad 0900 123 456.");

  return ok;
}

function sendBooking(event) {
  event.preventDefault();

  const booking = {
    id: "BS-" + String(Date.now()).slice(-6),
    serviceId: document.getElementById("service").value,
    barberId: document.getElementById("barber").value,
    date: document.getElementById("date").value,
    time: selectedTime,
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim().toLowerCase(),
    phone: document.getElementById("phone").value.trim(),
    note: document.getElementById("note").value.trim(),
    status: "potvrdená"
  };

  if (!checkForm(booking)) {
    document.getElementById("booking-form").scrollIntoView();
    return;
  }

  const start = timeToMinutes(booking.time);
  const end = start + getService(booking.serviceId).duration;
  if (!isTimeFree(booking.date, start, end, booking.barberId)) {
    showError("time", "Tento čas medzitým niekto obsadil. Vyberte iný.");
    selectedTime = "";
    showSlots();
    return;
  }

  const bookings = loadBookings();
  bookings.push(booking);
  saveBookings(bookings);

  showConfirmation(booking);
}

function showConfirmation(booking) {
  const service = getService(booking.serviceId);
  const barber = getBarber(booking.barberId);
  const end = minutesToTime(timeToMinutes(booking.time) + service.duration);
  const box = document.getElementById("confirmation");

  let note = "";
  if (booking.note !== "") {
    note = `<dt>Poznámka</dt><dd>${safeText(booking.note)}</dd>`;
  }

  box.innerHTML = `
    <h3>Rezervácia je potvrdená</h3>
    <p>Ďakujeme, ${safeText(booking.name)}. Tešíme sa na vás.</p>
    <dl class="details">
      <dt>Číslo rezervácie</dt><dd>${booking.id}</dd>
      <dt>Služba</dt><dd>${service.name}</dd>
      <dt>Barber</dt><dd>${barber.name}</dd>
      <dt>Termín</dt><dd>${prettyDate(booking.date)}, ${booking.time} – ${end}</dd>
      <dt>Cena</dt><dd>${service.price} €</dd>
      <dt>E-mail</dt><dd>${safeText(booking.email)}</dd>
      <dt>Telefón</dt><dd>${safeText(booking.phone)}</dd>
      ${note}
    </dl>
    <button type="button" class="button" id="new-booking">Nová rezervácia</button>`;

  document.getElementById("booking-form").hidden = true;
  box.hidden = false;
  box.focus();

  document.getElementById("new-booking").addEventListener("click", function () {
    document.getElementById("booking-form").reset();
    selectedTime = "";
    updateBarbers();
    showSlots();
    box.hidden = true;
    document.getElementById("booking-form").hidden = false;
  });
}

function getStatus(booking) {
  if (booking.status === "zrušená") {
    return "Zrušená";
  }
  if (new Date(booking.date + "T" + booking.time) < new Date()) {
    return "Uskutočnená";
  }
  return "Potvrdená";
}

function showMyBookings() {
  const search = document.getElementById("lookup").value.trim().toLowerCase();
  const box = document.getElementById("my-bookings");

  if (search === "") {
    box.innerHTML = `<p class="message">Zadajte e-mail alebo telefón.</p>`;
    return;
  }

  const found = [];
  for (const booking of loadBookings()) {
    if (booking.email === search || cleanPhone(booking.phone) === cleanPhone(search)) {
      found.push(booking);
    }
  }

  if (found.length === 0) {
    box.innerHTML = `<p class="message">Pre tento kontakt sme nenašli žiadne rezervácie.</p>`;
    return;
  }

  found.sort(function (a, b) {
    if (a.date + a.time < b.date + b.time) {
      return -1;
    }
    return 1;
  });

  box.innerHTML = "";
  for (const booking of found) {
    const service = getService(booking.serviceId);
    const barber = getBarber(booking.barberId);
    const status = getStatus(booking);

    let statusClass = "status-confirmed";
    if (status === "Zrušená") {
      statusClass = "status-cancelled";
    } else if (status === "Uskutočnená") {
      statusClass = "status-done";
    }

    let cancelButton = "";
    if (status === "Potvrdená") {
      cancelButton = `<button type="button" class="button button-small cancel-button">Zrušiť</button>`;
    }

    const card = document.createElement("article");
    card.className = "booking-card";
    card.innerHTML = `
      <div>
        <h3>${service.name}</h3>
        <p>${prettyDate(booking.date)} o ${booking.time} · ${barber.name} · ${service.price} €</p>
        <p>Číslo rezervácie: ${booking.id}</p>
      </div>
      <div>
        <span class="status ${statusClass}">${status}</span>
        ${cancelButton}
      </div>`;

    if (status === "Potvrdená") {
      const button = card.querySelector(".cancel-button");
      button.addEventListener("click", function () {
        if (button.textContent === "Zrušiť") {
          button.textContent = "Naozaj zrušiť?";
        } else {
          cancelBooking(booking.id);
        }
      });
    }

    box.appendChild(card);
  }
}

function cancelBooking(id) {
  const bookings = loadBookings();
  for (const booking of bookings) {
    if (booking.id === id) {
      booking.status = "zrušená";
    }
  }
  saveBookings(bookings);
  showMyBookings();
  showSlots();
}

function showOpenStatus() {
  const now = new Date();
  const hours = OPENING_HOURS[now.getDay()];
  const minutes = now.getHours() * 60 + now.getMinutes();
  const text = document.getElementById("open-status");

  if (hours !== null && minutes >= hours.open && minutes < hours.close) {
    text.textContent = "● Teraz máme otvorené do " + minutesToTime(hours.close);
  } else {
    text.textContent = "● Teraz máme zatvorené";
  }
}

function setupMenu() {
  const button = document.getElementById("menu-button");
  const menu = document.getElementById("menu");

  button.addEventListener("click", function () {
    menu.classList.toggle("open");
  });

  const links = menu.querySelectorAll("a");
  for (const link of links) {
    link.addEventListener("click", function () {
      menu.classList.remove("open");
    });
  }
}

function start() {
  addDemoBookings();
  showServices();
  showBarbers();
  showOpenStatus();
  setupMenu();

  const dateInput = document.getElementById("date");
  dateInput.min = todayText();
  dateInput.max = dayAfter(60);

  document.getElementById("service").addEventListener("change", function () {
    updateBarbers();
    showSlots();
  });
  document.getElementById("barber").addEventListener("change", showSlots);
  document.getElementById("date").addEventListener("change", showSlots);
  document.getElementById("booking-form").addEventListener("submit", sendBooking);

  const fields = ["service", "barber", "date", "name", "email", "phone"];
  for (const field of fields) {
    document.getElementById(field).addEventListener("input", function () {
      showError(field, "");
    });
  }

  document.getElementById("lookup-form").addEventListener("submit", function (event) {
    event.preventDefault();
    showMyBookings();
  });

  document.getElementById("year").textContent = new Date().getFullYear();
}

start();
