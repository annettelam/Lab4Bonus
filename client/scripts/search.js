import { strings } from "../lang/en"; // Import the localized strings
document
  .getElementById("searchForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const searchWord = document.getElementById("searchWord").value.trim();
    const result = document.getElementById("result");

    // Simple input validation: only letters and spaces, non-empty
    const isValidSearch = /^[A-Za-z\s]+$/.test(searchWord);

    if (!isValidSearch) {
      result.style.color = "red";
      result.textContent = strings.invalidInputSearch;
      return;
    }

    try {
      const response = await fetch(
        `https://cadan.xyz/app3/api/definitions?word=${encodeURIComponent(
          searchWord
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        result.style.color = "green";
        result.innerHTML = strings.wordFound
          .replace("{word}", data.word)
          .replace("{definition}", data.definition)
          .replace("{requestNumber}", data.requestNumber);
      } else if (response.status === 404) {
        result.style.color = "orange";
        result.textContent = strings.wordNotFound
          .replace("{word}", searchWord)
          .replace("{requestNumber}", data.requestNumber);
      } else {
        result.style.color = "red";
        result.textContent = data.message || strings.otherErrorSearch;
      }
    } catch (error) {
      result.style.color = "red";
      result.textContent = strings.serverError;
      console.error("Error:", error);
    }
  });
