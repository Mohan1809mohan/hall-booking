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

// SHOW OTHER FIELD
document.getElementById("eventType").addEventListener("change", function () {
  let other = document.getElementById("otherType");
  other.style.display = this.value === "Other" ? "block" : "none";
});

// 📅 BOOK FUNCTION
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
    alert("Fill all fields");
    return;
  }

  // CHECK CONFLICT
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
