function deleteRestaurant(restaurantID) {
    let confirmation = confirm("Reminder: Your data will be lost. Do you want to proceed?");
    
    if (!confirmation) {
        return; 
    }

    let link = '/delete-restaurant-ajax/';
    let data = { id: restaurantID };

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
            deleteRow(restaurantID);
        },
        error: function(xhr, status, error) {
            console.error("Error deleting restaurant:", error);
            alert("Failed to delete restaurant. Please try again.");
        }
    });
}

function deleteRow(restaurantID) {
    let table = document.getElementById("restaurantsTableBody");
    let rows = table.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        if (rows[i].cells[0].textContent == restaurantID) {
            table.deleteRow(i);
            break;
        }
    }
}