async function fetchSortedRestaurants() {
    const sortBy = document.getElementById("sortBy").value;
    const order = document.getElementById("order").value;

    try {
        const response = await fetch('/fetch-restaurants', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sortBy, order })
        });

        const data = await response.json();

        if (data.status === "success") {
            const tableBody = document.getElementById("restaurantsTableBody");
            tableBody.innerHTML = ""; // Clear previous results

            data.data.forEach(restaurant => {
                const row = `
                    <tr>
                        <td>${restaurant.restaurant_id}</td>
                        <td>${restaurant.name}</td>
                        <td>${restaurant.location}</td>
                        <td>${restaurant.cuisine_type}</td>
                        <td>${restaurant.rating}</td>
                        <td>${restaurant.review}</td>
                    </tr>`;
                tableBody.innerHTML += row;
            });
        }
    } catch (error) {
        console.error("Error fetching sorted restaurants:", error);
    }
}