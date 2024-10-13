import { strings } from "../lang/en"; // Import the localized strings

document
  .getElementById("storeForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const word = document.getElementById("word").value.trim();
    const definition = document.getElementById("definition").value.trim();
    const feedback = document.getElementById("feedback");

    const isValidWord = /^[A-Za-z\s]+$/.test(word);
    const isValidDefinition = /^[A-Za-z\s]+$/.test(definition);

    if (!isValidWord || !isValidDefinition) {
      feedback.style.color = "red";
      feedback.textContent = strings.invalidInputStore;
      return;
    }

    try {
      const response = await fetch("https://cadan.xyz/app3/api/definitions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word, definition }),
      });

      const data = await response.json();

      if (response.status === 201) {
        feedback.style.color = "green";
        feedback.textContent = strings.addSuccess;
        document.getElementById("storeForm").reset();
      } else if (response.status === 409) {
        feedback.style.color = "orange";
        feedback.textContent = strings.wordExists;
      } else {
        feedback.style.color = "red";
        feedback.textContent = data.message || strings.otherErrorStore;
      }
    } catch (error) {
      feedback.style.color = "red";
      feedback.textContent = strings.serverError;
      console.error("Error:", error);
    }
  });
