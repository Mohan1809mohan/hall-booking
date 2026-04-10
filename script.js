// 🔥 Firebase Config
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


// ✅ RUN AFTER PAGE LOAD
window.onload = function () {

  // 👇 GET ELEMENTS
  let eventType = document.getElementById("eventType");
  let otherInput = document.getElementById("otherType");

  // 👇 CHANGE EVENT
  eventType.addEventListener("change", function () {

    if (this.value === "Other") {
      otherInput.style.display = "block";
      otherInput.focus();   // 👈 auto focus (nice UX)
    } else {
      otherInput.style.display = "none";
      otherInput.value = "";
    }

  });

};


// 👤 LOGIN
function customerLogin() {
  let phone = document.getElementById("custPhone").value;

  if (phone.length < 10) {
    alert("Enter valid mobile number");
    return;
  }

  localStorage.setItem("customer", phone);

  document.getElementById("loginBox").style.display = "none";
  document.getElementById("bookingBox").style.display = "block";
}


// 📅 BOOK FUNCTION
function book() {
  let name = document.getElementById("name").value;
  let phone = localStorage.getItem("customer");
  let type = document.getElementById("eventType").value;
  let start = document.getElementById("start").value;
  let end = document.getElementById("end").value;

  // 👉 GET OTHER VALUE
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

      if (!(end <= b.start || start >= b.end)) {
        conflict = true;
      }
    });

    if (conflict) {
      alert("Date already booked ❌");
      return;
    }

    db.push({ name, phone, type, start, end });

    alert("Booking Confirmed 🎉");
  });
}
