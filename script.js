// 🔐 USERS (ONLY YOU + YOUR FATHER)
let users = {
  "9441319215": "1809",
  "9441576705": "9441"
};

// 💾 LOAD BOOKINGS
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

// 🚀 AUTO LOGIN
window.onload = function () {
  let user = localStorage.getItem("user");

  if (user) {
    showApp();
  }

  displayBookings();
};

// 🔐 LOGIN
function login() {
  let phone = document.getElementById("loginPhone").value.trim();
  let pass = document.getElementById("loginPassword").value.trim();

  if (!users[phone] || users[phone] !== pass) {
    alert("Invalid login ❌");
    return;
  }

  localStorage.setItem("user", phone);
  showApp();
}

// 🖥 SHOW APP
function showApp() {
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
}

// 🚪 LOGOUT
function logout() {
  localStorage.removeItem("user");
  location.reload();
}

// 🔄 SHOW/HIDE OTHER INPUT
function toggleOtherInput() {
  let type = document.getElementById("eventType").value;
  let otherBox = document.getElementById("otherType");

  if (type === "Other") {
    otherBox.style.display = "block";
  } else {
    otherBox.style.display = "none";
    otherBox.value = "";
  }
}

// 📅 BOOK FUNCTION
function book() {
  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let type = document.getElementById("eventType").value;
  let start = document.getElementById("start").value;
  let end = document.getElementById("end").value;

  // ✅ HANDLE "OTHER"
  if (type === "Other") {
    type = document.getElementById("otherType").value.trim();

    if (type === "") {
      alert("Please enter function type");
      return;
    }
  }

  if (!name || !phone || !type || !start || !end) {
    alert("Fill all fields");
    return;
  }

  if (start > end) {
    alert("Invalid dates");
    return;
  }

  // ✅ SAME DAY CHANGEOVER LOGIC
  let conflict = bookings.some(b => {
    return !(end <= b.start || start >= b.end);
  });

  if (conflict) {
    alert("Date already booked ❌");
    return;
  }

  // 💾 SAVE
  bookings.push({ name, phone, type, start, end });

  localStorage.setItem("bookings", JSON.stringify(bookings));

  displayBookings();
  clearForm();
}

// 📋 DISPLAY BOOKINGS
function displayBookings() {
  let list = document.getElementById("list");
  list.innerHTML = "";

  bookings.forEach((b, index) => {
    let li = document.createElement("li");
    li.innerHTML = `
      <b>${b.start} → ${b.end}</b><br>
      ${b.name} (${b.phone})<br>
      ${b.type}
      <br><br>
      <button onclick="deleteBooking(${index})">Delete</button>
    `;
    list.appendChild(li);
  });
}

// 🗑 DELETE BOOKING
function deleteBooking(index) {
  bookings.splice(index, 1);
  localStorage.setItem("bookings", JSON.stringify(bookings));
  displayBookings();
}

// 🔄 CLEAR FORM
function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("eventType").value = "";
  document.getElementById("otherType").value = "";
  document.getElementById("otherType").style.display = "none";
  document.getElementById("start").value = "";
  document.getElementById("end").value = "";
}
