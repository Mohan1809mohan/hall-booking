// Allowed numbers
let allowedUsers = ["9441576705", "9441319215"];

function login() {
  let phone = document.getElementById("loginPhone").value;

  if (allowedUsers.includes(phone)) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
  } else {
    alert("Invalid phone number");
  }
}

function book() {
  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let event = document.getElementById("eventType").value;
  let start = document.getElementById("start").value;
  let end = document.getElementById("end").value;

  if (!name || !phone || !event || !start || !end) {
    alert("Please fill all fields");
    return;
  }

  let booking = { name, phone, event, start, end };

  let data = JSON.parse(localStorage.getItem("bookings")) || [];
  data.push(booking);
  localStorage.setItem("bookings", JSON.stringify(data));

  display();
}

function display() {
  let list = document.getElementById("list");
  list.innerHTML = "";

  let data = JSON.parse(localStorage.getItem("bookings")) || [];

  data.forEach((b, index) => {
    let li = document.createElement("li");
    li.innerHTML = `
      <b>${b.event}</b> - ${b.name} (${b.phone}) <br>
      ${b.start} to ${b.end}
      <button onclick="deleteBooking(${index})">Delete</button>
    `;
    list.appendChild(li);
  });
}

function deleteBooking(index) {
  let data = JSON.parse(localStorage.getItem("bookings")) || [];
  data.splice(index, 1);
  localStorage.setItem("bookings", JSON.stringify(data));
  display();
}

display();
