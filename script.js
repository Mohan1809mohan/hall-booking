// 🔥 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCOCs4iVWCafdXPy-7VuMPu4ynwM95MRkA",
  authDomain: "hall-booking-504fd.firebaseapp.com",
  databaseURL: "https://hall-booking-504fd-default-rtdb.firebaseio.com",
  projectId: "hall-booking-504fd",
  storageBucket: "hall-booking-504fd.firebasestorage.app",
  messagingSenderId: "279784179164",
  appId: "1:279784179164:web:7645d8a4198982d68fbb19"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref("bookings");

// 🔐 ADMIN USERS
let users = {
  "9441319215": "1809",
  "9441576705": "9441"
};

// LOGIN
function login() {
  let phone = document.getElementById("loginPhone").value.trim();
  let pass = document.getElementById("loginPassword").value.trim();

  if (!users[phone] || users[phone] !== pass) {
    alert("Invalid login ❌");
    return;
  }

  localStorage.setItem("admin", phone);
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
}

// AUTO LOGIN
window.onload = function () {
  if (localStorage.getItem("admin")) {
    let loginSection = document.getElementById("loginSection");
    let mainApp = document.getElementById("mainApp");

    if (loginSection && mainApp) {
      loginSection.style.display = "none";
      mainApp.style.display = "block";
    }
  }

  loadBookings();
};

// LOGOUT
function logout() {
  localStorage.removeItem("admin");
  location.reload();
}

// SHOW OTHER INPUT
function toggleOtherInput() {
  let type = document.getElementById("eventType");
  let other = document.getElementById("otherType");

  if (!type || !other) return;

  if (type.value === "Other") {
    other.style.display = "block";
  } else {
    other.style.display = "none";
    other.value = "";
  }
}

// BOOK FUNCTION (PUBLIC)
function book() {
  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let type = document.getElementById("eventType").value;
  let start = document.getElementById("start").value;
  let end = document.getElementById("end").value;

  if (type === "Other") {
    type = document.getElementById("otherType").value;
  }

  if (!name || !phone || !type || !start || !end) {
    alert("Fill all fields");
    return;
  }

  if (start > end) {
    alert("Invalid dates");
    return;
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
      alert("Date already booked ❌");
      return;
    }

    db.push({ name, phone, type, start, end });
    alert("Booking successful ✅");
  });
}

// LOAD BOOKINGS
function loadBookings() {
  db.on("value", snap => {
    let list = document.getElementById("list");
    if (!list) return;

    list.innerHTML = "";

    snap.forEach(child => {
      let b = child.val();

      let li = document.createElement("li");
      li.innerHTML = `
        <b>${b.start} → ${b.end}</b><br>
        ${b.name} (${b.phone})<br>
        ${b.type}
      `;
      list.appendChild(li);
    });
  });
}
