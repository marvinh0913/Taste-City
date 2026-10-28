// Get the form element
let addUserForm = document.getElementById('add-user-form-ajax');

// Add event listener for form submission
addUserForm.addEventListener("submit", function (e) {
    // Prevent default form submission
    e.preventDefault();

    // Get form field values
    let inputUsername = document.getElementById("input-username");
    let inputUserEmail = document.getElementById("input-user-email");
    let inputPassword = document.getElementById("input-password");
    let inputDateJoined = document.getElementById("input-date-joined");

    let usernameValue = inputUsername.value;
    let userEmailValue = inputUserEmail.value;
    let passwordValue = inputPassword.value;
    let dateJoinedValue = inputDateJoined.value;

    // Prepare data to send
    let data = {
        username: usernameValue,
        user_email: userEmailValue,
        password: passwordValue,
        date_joined: dateJoinedValue
    };

    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-user-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Handle response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            addRowToTable(xhttp.response);

            // Clear input fields
            inputUsername.value = '';
            inputUserEmail.value = '';
            inputPassword.value = '';
            inputDateJoined.value = '';
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    };

    // Send request
    xhttp.send(JSON.stringify(data));
});

// Function to add a new row to the users table
function addRowToTable(data) {
    let currentTable = document.querySelector("table tbody");
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    // Create a new row
    let row = document.createElement("TR");
    let userIdCell = document.createElement("TD");
    let usernameCell = document.createElement("TD");
    let userEmailCell = document.createElement("TD");
    let dateJoinedCell = document.createElement("TD");

    // Fill cells with data
    userIdCell.innerText = newRow.user_id;
    usernameCell.innerText = newRow.username;
    userEmailCell.innerText = newRow.user_email;
    dateJoinedCell.innerText = newRow.date_joined;

    // Append cells to the row
    row.appendChild(userIdCell);
    row.appendChild(usernameCell);
    row.appendChild(userEmailCell);
    row.appendChild(dateJoinedCell);

    // Append row to the table
    currentTable.appendChild(row);
}