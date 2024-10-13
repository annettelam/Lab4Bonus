document
  .getElementById("searchForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const searchWord = document.getElementById("searchWord").value.trim();
    const result = document.getElementById("result");

    // Simple input validation: only letters and spaces, non-empty
    const isValidSearch = /^[A-Za-z\s]+$/.test(searchWord);

    if (!isValidSearch) {
      result.style.color = "red";
      result.textContent =
        "Invalid input. Only letters and spaces are allowed, and the field cannot be empty.";
      return;
    }

    try {
      const response = await fetch(
        `https://cadan.xyz/app3/api/definitions?word=${encodeURIComponent(
          searchWord
        )}`,
        {
          // Updated hosted API endpoint
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        // Word found
        result.style.color = "green";
        result.innerHTML = `<strong>${data.word}:</strong> ${data.definition}<br>Request #${data.requestNumber}`;
      } else if (response.status === 404) {
        // Word not found
        result.style.color = "orange";
        result.textContent = `Request #${data.requestNumber}, word '${searchWord}' not found!`;
      } else {
        // Other errors
        result.style.color = "red";
        result.textContent =
          data.message || "An error occurred while searching for the word.";
      }
    } catch (error) {
      result.style.color = "red";
      result.textContent =
        "Failed to connect to the server. Please ensure Server 2 is running.";
      console.error("Error:", error);
    }
  });
