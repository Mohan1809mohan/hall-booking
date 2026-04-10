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
  let type = eventType.value;
  let start = startInput.value;
  let end = endInput.value;

  if (type === "Other") type = otherType.value;

  db.once("value", snap => {
    let conflict = false;

    snap.forEach(c => {
      let b = c.val();
      if (!(end <= b.start || start >= b.end)) conflict = true;
    });

    if (conflict) return alert("Already booked");

    db.push({ name, phone, type, start, end });

    alert("Booked");

    loadCalendar();
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
