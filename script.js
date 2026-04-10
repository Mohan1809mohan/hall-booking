// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "PASTE",
  authDomain: "PASTE",
  databaseURL: "PASTE",
  projectId: "PASTE"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref("bookings");


// 👤 CUSTOMER LOGIN
function customerLogin() {
  let phone = document.getElementById("custPhone").value;

  if (!phone) return alert("Enter phone");

  localStorage.setItem("customer", phone);

  document.getElementById("loginBox").style.display = "none";
  document.getElementById("bookingBox").style.display = "block";

  loadCalendar();
}


// 🚪 LOGOUT
function logout() {
  localStorage.removeItem("customer");
  location.reload();
}


// 🔁 OTHER TYPE
function handleOther() {
  let type = document.getElementById("eventType").value;
  let other = document.getElementById("otherType");

  other.style.display = (type === "Other") ? "block" : "none";
}


// 📅 BOOK FUNCTION (FIXED)
function book() {

  let name = document.getElementById("name").value;
  let phone = localStorage.getItem("customer");
  let type = document.getElementById("eventType").value;
  let start = document.getElementById("start").value;
  let end = document.getElementById("end").value;

  if (type === "Other") {
    type = document.getElementById("otherType").value;
  }

  if (!name || !type || !start || !end) {
    return alert("Fill all fields");
  }

  db.once("value", snap => {
    let conflict = false;

    snap.forEach(child => {
      let b = child.val();

      if (!(end <= b.start || start >= b.end)) {
        conflict = true;
      }
    });

    if (conflict) {
      alert("Already booked ❌");
      return;
    }

    db.push({ name, phone, type, start, end });

    alert("Booked ✅");

    loadCalendar();
  });
}


// 📅 CALENDAR UI
function loadCalendar() {

  db.once("value", snap => {

    let events = [];

    snap.forEach(child => {
      let b = child.val();

      events.push({
        title: b.type,
        start: b.start,
        end: b.end,
        color: "red"
      });
    });

    let calendarEl = document.getElementById("calendar");

    let calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      events: events
    });

    calendar.render();
  });
}


// 🧑‍💼 ADMIN LOGIN
function adminLogin() {

  let phone = document.getElementById("adminPhone").value;

  if (phone !== "9441319215" && phone !== "9441576705") {
    return alert("Access denied");
  }

  document.getElementById("login").style.display = "none";
  document.getElementById("panel").style.display = "block";

  loadAdmin();
}


// 📋 ADMIN VIEW
function loadAdmin() {
  db.on("value", snap => {

    let list = document.getElementById("list");
    list.innerHTML = "";

    snap.forEach(child => {
      let b = child.val();
      let id = child.key;

      let li = document.createElement("li");

      li.innerHTML = `
        ${b.start} → ${b.end}<br>
        ${b.name}<br>
        ${b.type}
        <button onclick="deleteBooking('${id}')">Delete</button>
      `;

      list.appendChild(li);
    });
  });
}


// 🗑 DELETE
function deleteBooking(id) {
  db.child(id).remove();
}
