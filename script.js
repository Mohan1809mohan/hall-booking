let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

const form = document.getElementById("bookingForm");
const list = document.getElementById("bookingList");

displayBookings();

// 🔐 LOGIN (YOU + YOUR FATHER)
function login() {
  let phone = document.getElementById("loginPhone").value;

  let allowedNumbers = ["9441576705", "9441319215"];

  if (allowedNumbers.includes(phone)) {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
  } else {
    alert("Invalid phone number");
  }
}

// 📅 BOOKING
form.addEventListener("submit", function(e) {
  e.preventDefault();

  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let startDate = document.getElementById("startDate").value;
  let endDate = document.getElementById("endDate").value;

  if (endDate < startDate) {
    alert("End date cannot be before start date");
    return;
  }

  let exists = bookings.some(b => {
    return !(endDate < b.startDate || startDate > b.endDate);
  });

  if (exists) {
    alert("Dates already booked");
    return;
  }

  bookings.push({ name, phone, startDate, endDate });
  localStorage.setItem("bookings", JSON.stringify(bookings));

  displayBookings();
  form.reset();
});

// 📋 DISPLAY + DELETE
function displayBookings() {
  list.innerHTML = "";

  bookings.forEach((b, index) => {
    let li = document.createElement("li");

    li.innerHTML = `
      ${b.startDate} to ${b.endDate} - ${b.name} (${b.phone})
      <button onclick="deleteBooking(${index})">Delete</button>
    `;

    list.appendChild(li);
  });
}

function deleteBooking(index) {
  bookings.splice(index, 1);
  localStorage.setItem("bookings", JSON.stringify(bookings));
  displayBookings();
}