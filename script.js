// 🔥 FIREBASE CONFIG (Replace later with your own if needed)
const firebaseConfig = {
  apiKey: "AIzaSyCOCs4iVWCafdXPy-7VuMPu4ynwM95MRkA",
  authDomain: "hall-booking-504fd.firebaseapp.com",
  projectId: "hall-booking-504fd",
  storageBucket: "hall-booking-504fd.firebasestorage.app",
  messagingSenderId: "279784179164",
  appId: "1:279784179164:web:5726f97e13e548278fbb19",
  measurementId: "G-20TVX3JJTZ"
};


firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref("bookings");

// 🔐 USERS
let users = {
  "9441319215": "1809",
  "9441576705": "9441"
};

// AUTO LOGIN
window.onload = function () {
  let user = localStorage.getItem("user");
  if (user) showApp();

  loadBookings();
};

// LOGIN
function login() {
  let phone = loginPhone.value.trim();
  let pass = loginPassword.value.trim();

  if (!users[phone] || users[phone] !== pass) {
    alert("Invalid login ❌");
    return;
  }

  localStorage.setItem("user", phone);
  showApp();
}

// SHOW APP
function showApp() {
  loginSection.style.display = "none";
  mainApp.style.display = "block";
}

// LOGOUT
function logout() {
  localStorage.removeItem("user");
  location.reload();
}

// BOOK FUNCTION
function book() {
  let name = nameInput.value;
  let phone = phoneInput.value;
  let type = eventType.value;
  let start = startInput.value;
  let end = endInput.value;

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

      // ✅ NEW LOGIC (ALLOW SAME DAY CHANGEOVER)
      if (!(end <= b.start || start >= b.end)) {
        conflict = true;
      }
    });

    if (conflict) {
      alert("Date already booked ❌");
      return;
    }

    db.push({ name, phone, type, start, end });
  });
}

// LOAD BOOKINGS
function loadBookings() {
  db.on("value", snap => {
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

// ELEMENT SHORTCUTS
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const eventType = document.getElementById("eventType");
const startInput = document.getElementById("start");
const endInput = document.getElementById("end");
