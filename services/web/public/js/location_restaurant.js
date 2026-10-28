async function fetchStates() {
    try {
      const response = await fetch('http://localhost:2212/states');
      const data = await response.json();
      const stateSelect = document.getElementById("stateSelect");
  
      // Clear any existing options and add a default one
      stateSelect.innerHTML = '<option value="">--Select a State--</option>';
  
      data.states.forEach(state => {
        const option = document.createElement("option");
        option.value = state;
        option.text = state;
        stateSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  }
  
  // Fetch and populate cities for the selected state
  async function fetchCities() {
    const state = document.getElementById("stateSelect").value;
    const citySelect = document.getElementById("citySelect");
    
    // Clear existing options and set a default
    citySelect.innerHTML = '<option value="">--Select a City--</option>';
    if (!state) return; // No state selected
  
    try {
      const response = await fetch(`http://localhost:2212/states/${state}/cities`);
      const data = await response.json();
      if (data.cities) {
        data.cities.forEach(city => {
          const option = document.createElement("option");
          option.value = city;
          option.text = city;
          citySelect.appendChild(option);
        });
      } else {
        console.error("No cities found for state:", state);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    // Fetch states on page load
    fetchStates();
    
    // Add event listener to update cities dropdown when state changes
    const stateSelect = document.getElementById("stateSelect");
    stateSelect.addEventListener("change", fetchCities);
  
    // Set up combined location update
    const citySelect = document.getElementById("citySelect");
    const locationInput = document.getElementById("input-location");
    
    function updateLocationField() {
      const state = stateSelect.value;
      const city = citySelect.value;
      if (state && city) {
        locationInput.value = `${city}, ${state}`;
      } else {
        locationInput.value = "";
      }
    }
    
    // Attach event listeners to update location when either dropdown changes
    stateSelect.addEventListener("change", updateLocationField);
    citySelect.addEventListener("change", updateLocationField);
  });