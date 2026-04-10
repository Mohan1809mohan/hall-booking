// 🔥 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCOCs4iVWCafdXPy-7VuMPu4ynwM95MRkA",
  authDomain: "hall-booking-504fd.firebaseapp.com",
  databaseURL: "https://hall-booking-504fd-default-rtdb.firebaseio.com",
  projectId: "hall-booking-504fd"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref("bookings");


// ✅ CUSTOMER LOGIN
function customerLogin() {
  let phone = document.getElementById("custPhone").value;

  if (!phone) return alert("Enter phone");

  localStorage.setItem("user", phone);
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("bookingBox").style.display = "block";
}


// ✅ LOGOUT
function logout() {
  localStorage.removeItem("user");
  location.reload();
}


// ✅ OTHER INPUT
function handleOther() {
  let type = document.getElementById("eventType").value;
  document.getElementById("otherType").style.display =
    type === "Other" ? "block" : "none";
}


// ✅ BOOKING
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
    return alert("Fill all fields");
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
      return alert("Already Booked ❌");
    }

    db.push({ name, phone, type, start, end });

    alert("Booking Successful ✅");
  });
}


// ✅ ADMIN LOGIN
function adminLogin() {
  let phone = document.getElementById("adminPhone").value;

  if (phone !== "9441319215" && phone !== "9441576705") {
    return alert("Access Denied");
  }

  document.getElementById("login").style.display = "none";
  document.getElementById("panel").style.display = "block";

  loadAdmin();
}


// ✅ ADMIN BOOK
function adminBook() {

  let name = document.getElementById("aname").value;
  let phone = document.getElementById("aphone").value;
  let start = document.getElementById("astart").value;
  let end = document.getElementById("aend").value;

  if (!name || !phone || !start || !end) {
    return alert("Fill all fields");
  }

  db.push({ name, phone, start, end, type: "Manual" });

  alert("Added ✅");
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
