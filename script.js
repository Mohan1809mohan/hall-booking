// 🔥 Firebase Config (keep your own values)
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


// ✅ WAIT FOR PAGE LOAD (IMPORTANT FIX)
document.addEventListener("DOMContentLoaded", function () {

  const eventType = document.getElementById("eventType");
  const otherInput = document.getElementById("otherType");

  eventType.addEventListener("change", function () {
    if (this.value === "Other") {
      otherInput.style.display = "block";
      otherInput.focus(); // nice UX
    } else {
      otherInput.style.display = "none";
      otherInput.value = "";
    }
  });

});


// 👤 CUSTOMER LOGIN
function customerLogin() {
  let phone = document.getElementById("custPhone").value;

  if (!phone || phone.length < 10) {
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

  // 👉 handle "Other"
  if (type === "Other") {
    type = document.getElementById("otherType").value;
  }

  if (!name || !type || !start || !end) {
    alert("Fill all fields");
    return;
  }

  // ❌ CHECK DATE CONFLICT
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

    // 🔄 clear form
    document.getElementById("name").value = "";
    document.getElementById("eventType").value = "";
    document.getElementById("otherType").value = "";
    document.getElementById("otherType").style.display = "none";
    document.getElementById("start").value = "";
    document.getElementById("end").value = "";
  });
}
