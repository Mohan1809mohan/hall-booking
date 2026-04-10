// 🔥 Firebase Config (PUT YOUR REAL VALUES)
const firebaseConfig = {
  apiKey: "PASTE_HERE",
  authDomain: "PASTE_HERE",
  databaseURL: "PASTE_HERE",
  projectId: "PASTE_HERE"
};

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

  if (type === "Other") {
    other.style.display = "block";
  } else {
    other.style.display = "none";
    other.value = "";
  }
}


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


// ✅ LOAD ADMIN DATA
function loadAdmin() {

  db.on("value", (snap) => {

    let list = document.getElementById("list");

    if (!list) return; // prevents error on customer page

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
