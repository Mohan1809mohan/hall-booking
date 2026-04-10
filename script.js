// 🔥 FIREBASE CONFIG (YOUR REAL VALUES)
const firebaseConfig = {
  apiKey: "AIzaSyCOCs4iVWCafdXPy-7VuMPu4ynwM95MRkA",
  authDomain: "hall-booking-504fd.firebaseapp.com",
  databaseURL: "https://hall-booking-504fd-default-rtdb.firebaseio.com",
  projectId: "hall-booking-504fd",
  storageBucket: "hall-booking-504fd.firebasestorage.app",
  messagingSenderId: "279784179164",
  appId: "1:279784179164:web:5726f97e13e548278fbb19",
  measurementId: "G-20TVX3JJTZ"
};

// ✅ INIT FIREBASE (COMPAT)
firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref("bookings");


// ✅ CUSTOMER LOGIN
function customerLogin() {
  let phone = document.getElementById("custPhone").value;

  if (!phone) {
    alert("Enter phone number");
    return;
  }

  localStorage.setItem("user", phone);

  document.getElementById("loginBox").style.display = "none";
  document.getElementById("bookingBox").style.display = "block";
}


// ✅ LOGOUT
function logout() {
  localStorage.removeItem("user");
  location.reload();
}


// ✅ SHOW OTHER INPUT
function handleOther() {
  let type = document.getElementById("eventType").value;
  let other = document.getElementById("otherType");

  other.style.display = (type === "Other") ? "block" : "none";
}


// ✅ CUSTOMER BOOKING
function book() {

  let name = document.getElementById("name").value;
  let phone = localStorage.getItem("user");
  let type = document.getElementById("eventType").value;
  let start = document.getElementById("start").value;
  let end = document.getElementById("end").value;

  if (type === "Other") {
    type = document.getElementById("otherType").value;
  }

  if (!name || !type || !start || !end) {
    alert("Fill all fields ❗");
    return;
  }

  db.once("value").then((snap) => {

    let conflict = false;

    snap.forEach((child) => {
      let b = child.val();

      if (!(end <= b.start || start >= b.end)) {
        conflict = true;
      }
    });

    if (conflict) {
      alert("Already booked ❌");
      return;
    }

    db.push({
      name: name,
      phone: phone,
      type: type,
      start: start,
      end: end
    });

    alert("Booking Successful ✅");
  });
}


// ✅ ADMIN LOGIN
function adminLogin() {
  let phone = document.getElementById("adminPhone").value;

  if (phone !== "9441319215" && phone !== "9441576705") {
    alert("Access Denied");
    return;
  }

  document.getElementById("login").style.display = "none";
  document.getElementById("panel").style.display = "block";

  loadAdmin();
}


// ✅ ADMIN BOOKING
function adminBook() {

  let name = document.getElementById("aname").value;
  let phone = document.getElementById("aphone").value;
  let start = document.getElementById("astart").value;
  let end = document.getElementById("aend").value;

  if (!name || !phone || !start || !end) {
    alert("Fill all fields");
    return;
  }

  db.push({
    name: name,
    phone: phone,
    start: start,
    end: end,
    type: "Manual Booking"
  });

  alert("Admin Booking Added ✅");
}


// ✅ LOAD ADMIN DATA
function loadAdmin() {

  db.on("value", (snap) => {

    let list = document.getElementById("list");
    if (!list) return;

    list.innerHTML = "";

    snap.forEach((child) => {

      let b = child.val();
      let id = child.key;

      let li = document.createElement("li");

      li.innerHTML = `
        <b>${b.start} → ${b.end}</b><br>
        ${b.name} (${b.phone})<br>
        ${b.type}
        <br><button onclick="deleteBooking('${id}')">Delete</button>
      `;

      list.appendChild(li);
    });

  });
}


// ✅ DELETE
function deleteBooking(id) {
  db.child(id).remove();
}
