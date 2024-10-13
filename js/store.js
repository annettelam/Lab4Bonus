// DISCLOSURE: I've used ChatGPT to code this lab.
// I've also tried my best to use OOP.

// HOSTED URL for Server 1: https://comp4537-lab4-server1.netlify.app/ 
// HOSTED URL for Server 2: https://comp-4537-lab4-server2.vercel.app/ 

// This lab was good practice on working and learning CORS, Fetch API, and OOP in JavaScript.

class DictionaryDefinition {
    constructor() {
        this.wordInput = document.getElementById("word");
        this.definitionInput = document.getElementById("definition");
        this.responseDiv = document.getElementById("responseDiv");
    }

    async createDefinition(event) {
        event.preventDefault();

        const word = this.wordInput.value.toLowerCase();
        const definition = this.definitionInput.value;

        // Check if the word contains any numbers
        if (/\d/.test(word)) {
            this.responseDiv.textContent = strings.response.wordContainsNumbers;
            return;
        }

        try {
            const response = await fetch('https://comp-4537-lab4-server2.vercel.app/?=', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ word, definition }),
            });

            if (response.ok) {
                const data = await response.json();
                this.responseDiv.textContent = strings.response.success.replace('{message}', data.message);
            } else {
                const data = await response.json();
                this.responseDiv.textContent = strings.response.error.replace('{message}', data.message);
            }
        } catch (error) {
            console.error('Error creating definition:', error);
            this.responseDiv.textContent = strings.response.genericError;
        }
    }
}

const dictionaryDefinition = new DictionaryDefinition();

document.querySelector('form').addEventListener('submit', (event) => {
    dictionaryDefinition.createDefinition(event);
});