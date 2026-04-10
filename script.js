const firebaseConfig = {
  apiKey: "PASTE",
  authDomain: "PASTE",
  databaseURL: "PASTE",
  projectId: "PASTE"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref("bookings");

// CUSTOMER LOGIN
function customerLogin() {
  let phone = custPhone.value;
  if (!phone) return alert("Enter phone");

  localStorage.setItem("user", phone);

  loginBox.style.display = "none";
  bookingBox.style.display = "block";

  loadCalendar();
}

// LOGOUT
function logout() {
  localStorage.removeItem("user");
  location.reload();
}

// OTHER OPTION
function handleOther() {
  otherType.style.display = (eventType.value === "Other") ? "block" : "none";
}

// BOOK
function book() {

  let name = document.getElementById("name").value;
  let phone = localStorage.getItem("user");

  let type = document.getElementById("eventType").value;

  let start = document.getElementById("start").value;
  let end = document.getElementById("end").value;

  if (type === "Other") {
    type = document.getElementById("otherType").value;
  }

  // ✅ validation
  if (!name || !type || !start || !end) {
    alert("Fill all fields ❗");
    return;
  }

  // ✅ check conflict
  db.once("value", snap => {

    let conflict = false;

    snap.forEach(child => {
      let b = child.val();

      if (!(end <= b.start || start >= b.end)) {
        conflict = true;
      }
    });

    if (conflict) {
      alert("Already booked ❌");
      return;
    }

    // ✅ save
    db.push({
      name: name,
      phone: phone,
      type: type,
      start: start,
      end: end
    });

    alert("Booking Successful ✅");

    // clear form
    document.getElementById("name").value = "";
    document.getElementById("eventType").value = "";
    document.getElementById("otherType").value = "";
    document.getElementById("otherType").style.display = "none";
    document.getElementById("start").value = "";
    document.getElementById("end").value = "";
  });
}

// CALENDAR
function loadCalendar() {
  db.once("value", snap => {

    let events = [];

    snap.forEach(c => {
      let b = c.val();

      events.push({
        title: b.type,
        start: b.start,
        end: b.end
      });
    });

    let cal = new FullCalendar.Calendar(calendar, {
      initialView: "dayGridMonth",
      events: events
    });

    cal.render();
  });
}

// ADMIN LOGIN
function adminLogin() {
  let phone = adminPhone.value;

  if (phone !== "9441319215" && phone !== "9441576705")
    return alert("Denied");

  login.style.display = "none";
  panel.style.display = "block";

  loadAdmin();
}

// ADMIN BOOK
function adminBook() {
  let name = aname.value;
  let phone = aphone.value;
  let start = astart.value;
  let end = aend.value;

  db.push({ name, phone, start, end, type: "Manual" });
}

// ADMIN LIST
function loadAdmin() {
  db.on("value", snap => {

    list.innerHTML = "";

    snap.forEach(c => {
      let b = c.val();
      let id = c.key;

      list.innerHTML += `
        <li>
          ${b.start} → ${b.end}<br>
          ${b.name}<br>
          ${b.type}
          <button onclick="db.child('${id}').remove()">Delete</button>
        </li>
      `;
    });

  });
}
