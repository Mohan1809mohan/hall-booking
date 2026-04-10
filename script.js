// 🔥 Firebase Config (PUT YOUR VALUES)
const firebaseConfig = {
  apiKey: "PASTE_HERE",
  authDomain: "PASTE_HERE",
  databaseURL: "PASTE_HERE",
  projectId: "PASTE_HERE",
  storageBucket: "PASTE_HERE",
  messagingSenderId: "PASTE_HERE",
  appId: "PASTE_HERE"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref("bookings");


// 🚀 RUN AFTER PAGE LOAD
window.onload = function () {

  // ✅ Auto login (remember user)
  let savedUser = localStorage.getItem("customer");
  if (savedUser) {
    showBooking();
  }

  // ✅ Other option logic
  let eventType = document.getElementById("eventType");
  let otherInput = document.getElementById("otherType");

  if (eventType) {
    eventType.addEventListener("change", function () {
      if (this.value === "Other") {
        otherInput.style.display = "block";
        otherInput.focus();
      } else {
        otherInput.style.display = "none";
        otherInput.value = "";
      }
    });
  }

};


// 👤 CUSTOMER LOGIN
function customerLogin() {
  let phone = document.getElementById("custPhone").value;

  if (!phone || phone.length < 10) {
    alert("Enter valid mobile number");
    return;
  }

  // ✅ Save login
  localStorage.setItem("customer", phone);

  showBooking();
}


// 📦 SHOW BOOKING PAGE
function showBooking() {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("bookingBox").style.display = "block";
}


// 🚪 LOGOUT
function logout() {
  localStorage.removeItem("customer");
  location.reload();
}


// 📅 BOOK FUNCTION
function book() {
  let name = document.getElementById("name").value;
  let phone = localStorage.getItem("customer");
  let type = document.getElementById("eventType").value;
  let start = document.getElementById("start").value;
  let end = document.getElementById("end").value;

  // 👉 Handle "Other"
  if (type === "Other") {
    type = document.getElementById("otherType").value;
  }

  if (!name || !type || !start || !end) {
    alert("Fill all fields");
    return;
  }

  // ❌ DATE CONFLICT CHECK
  db.once("value", snap => {
    let conflict = false;

    snap.forEach(child => {
      let b = child.val();

      // overlap condition
      if (!(end <= b.start || start >= b.end)) {
        conflict = true;
      }
    });

    if (conflict) {
      alert("Date already booked ❌");
      return;
    }

    // ✅ SAVE BOOKING
    db.push({ name, phone, type, start, end });

    alert("Booking Confirmed 🎉");

    // 🔄 RESET FORM
    document.getElementById("name").value = "";
    document.getElementById("eventType").value = "";
    document.getElementById("otherType").value = "";
    document.getElementById("otherType").style.display = "none";
    document.getElementById("start").value = "";
    document.getElementById("end").value = "";
  });
}
