async function checkSpelling() {
    const text = document.getElementById("textToCheck").value;
  
    try {
      const response = await fetch('/spellcheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
  
      const data = await response.json();
  
      if (data.status === "success") {
        console.log("Spellcheck result:", data.result);
        // Example: Display the results in a div with id "spellResults"
        const resultDiv = document.getElementById("spellResults");
        resultDiv.innerHTML = '';
        for (const [word, suggestions] of Object.entries(data.result)) {
          resultDiv.innerHTML += `<p><strong>${word}</strong>: ${suggestions.join(', ')}</p>`;
        }
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error checking spelling:", error);
    }
  }