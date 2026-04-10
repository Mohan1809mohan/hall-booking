// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "PASTE",
  authDomain: "PASTE",
  databaseURL: "PASTE",
  projectId: "PASTE",
  storageBucket: "PASTE",
  messagingSenderId: "PASTE",
  appId: "PASTE"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref("bookings");

// LOGIN
function customerLogin() {
  let phone = document.getElementById("custPhone").value;

  if (phone.length < 10) {
    alert("Enter valid number");
    return;
  }

  localStorage.setItem("customer", phone);

  document.getElementById("loginBox").style.display = "none";
  document.getElementById("bookingBox").style.display = "block";
}

// OTHER OPTION
document.getElementById("eventType").addEventListener("change", function () {
  let other = document.getElementById("otherType");
  other.style.display = this.value === "Other" ? "block" : "none";
});

// BOOK
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
