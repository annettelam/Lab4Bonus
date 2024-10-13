document
  .getElementById("storeForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const word = document.getElementById("word").value.trim();
    const definition = document.getElementById("definition").value.trim();
    const feedback = document.getElementById("feedback");

    // Simple input validation: only letters and spaces, non-empty
    const isValidWord = /^[A-Za-z\s]+$/.test(word);
    const isValidDefinition = /^[A-Za-z\s]+$/.test(definition);

    if (!isValidWord || !isValidDefinition) {
      feedback.style.color = "red";
      feedback.textContent =
        "Invalid input. Only letters and spaces are allowed, and fields cannot be empty.";
      return;
    }

    try {
      const response = await fetch("https://cadan.xyz/app3/api/definitions", {
        // Updated to use hosted API
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word, definition }),
      });

      const data = await response.json();

      if (response.status === 201) {
        // Successfully created
        feedback.style.color = "green";
        feedback.textContent = data.message;
        // Optionally, clear the form fields
        document.getElementById("storeForm").reset();
      } else if (response.status === 409) {
        // Conflict: word already exists
        feedback.style.color = "orange";
        feedback.textContent = data.message;
      } else {
        // Other errors
        feedback.style.color = "red";
        feedback.textContent =
          data.message || "An error occurred while adding the word.";
      }
    } catch (error) {
      feedback.style.color = "red";
      feedback.textContent =
        "Failed to connect to the server. Please ensure Server 2 is running.";
      console.error("Error:", error);
    }
  });
