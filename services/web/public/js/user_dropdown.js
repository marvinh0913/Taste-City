async function fetchUsers() {
    try {
      const response = await fetch('/api/users');
      const users = await response.json();
      const userSelect = document.getElementById("userSelect");
  
      // Clear existing options and add the default option
      userSelect.innerHTML = '<option value="">--Select a User--</option>';
      
      users.forEach(user => {
        const option = document.createElement("option");
        option.value = user.user_id;  // Use the user_id as the value
        option.text = user.username;   // Display the username
        userSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }
  
  // Ensure the dropdown is populated when the DOM loads.
  document.addEventListener("DOMContentLoaded", fetchUsers);