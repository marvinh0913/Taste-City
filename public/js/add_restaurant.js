// Get the objects we need to modify

let addRestaurantForm = document.getElementById('add-restaurant-form-ajax');

// Modify the objects we need
addRestaurantForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputUserId = document.getElementById("input-user-id");
    let inputName = document.getElementById("input-name");
    let inputLocation = document.getElementById("input-location");
    let inputCuisineType = document.getElementById("input-cuisine-type");
    let inputRating = document.getElementById("input-rating");
    let inputReview = document.getElementById("input-review");

    // Get the values from the form fields
    let userIdValue = inputUserId.value;
    let nameValue = inputName.value;
    let locationValue = inputLocation.value;
    let cuisineTypeValue = inputCuisineType.value;
    let ratingValue = inputRating.value;
    let reviewValue = inputReview.value;

    // Put our data we want to send in a javascript object
    let data = {
        user_id: userIdValue,
        name: nameValue,
        location: locationValue,
        cuisine_type: cuisineTypeValue,
        rating: ratingValue,
        review: reviewValue
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-restaurant-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputUserId.value = '';
            inputName.value = '';
            inputLocation.value = '';
            inputCuisineType.value = '';
            inputRating.value = '';
            inputReview.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

// Creates a single row from an Object representing a single record from the restaurants table
addRowToTable = (data) => {

    // Get a reference to the current table on the page
    let currentTable = document.getElementById("restaurants-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    // Create a row and cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let userIdCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let locationCell = document.createElement("TD");
    let cuisineTypeCell = document.createElement("TD");
    let ratingCell = document.createElement("TD");
    let reviewCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.restaurant_id;
    userIdCell.innerText = newRow.user_id;
    nameCell.innerText = newRow.name;
    locationCell.innerText = newRow.location;
    cuisineTypeCell.innerText = newRow.cuisine_type;
    ratingCell.innerText = newRow.rating;
    reviewCell.innerText = newRow.review;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteRestaurant(newRow.restaurant_id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(userIdCell);
    row.appendChild(nameCell);
    row.appendChild(locationCell);
    row.appendChild(cuisineTypeCell);
    row.appendChild(ratingCell);
    row.appendChild(reviewCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.restaurant_id);
    
    // Add the row to the table
    currentTable.appendChild(row);
}
