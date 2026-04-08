// Load saved bookings
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

// Show saved bookings
displayBookings();

// 🔐 LOGIN FUNCTION
function login() {
  let phone = document.getElementById("loginPhone").value;

  // ✅ Only allowed numbers (removed 7674099843)
  let allowedNumbers = ["9441319215", "9441576705"];

  if (!allowedNumbers.includes(phone)) {
    alert("Access denied ❌");
    return;
  }

  document.getElementById("loginSection").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
}

  document.getElementById("loginSection").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
}

// 📅 BOOK FUNCTION
function book() {
  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let eventType = document.getElementById("eventType").value;
  let start = document.getElementById("start").value;
  let end = document.getElementById("end").value;

  if (!name || !phone || !eventType || !start || !end) {
    alert("Fill all fields ⚠️");
    return;
  }

  if (start > end) {
    alert("End date must be after start date");
    return;
  }

  // 🚫 CHECK DATE OVERLAP
  let conflict = bookings.some(b => {
    return !(end < b.start || start > b.end);
  });

  if (conflict) {
    alert("Date already booked ❌");
    return;
  }

  // ✅ SAVE BOOKING
  bookings.push({ name, phone, eventType, start, end });

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
      ${b.eventType}
      <br><br>
      <button onclick="deleteBooking(${index})">Delete</button>
    `;
    list.appendChild(li);
  });
}

// 🗑 DELETE FUNCTION
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
  document.getElementById("start").value = "";
  document.getElementById("end").value = "";
}
