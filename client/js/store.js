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
            this.responseDiv.textContent = 'Word should not contain numbers.';
            return;
        }

        try {
            const response = await fetch('https://lab4-server.vercel.app/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ word, definition }),
            });

            if (response.ok) {
                const data = await response.json();
                this.responseDiv.textContent = `Response: ${data.message}`;
            } else {
                const data = await response.json();
                this.responseDiv.textContent = `Error: ${data.message}`;
            }
        } catch (error) {
            console.error('Error creating definition:', error);
            this.responseDiv.textContent = 'An error occurred while creating the definition.';
        }
    }
}

const dictionaryDefinition = new DictionaryDefinition();
document.querySelector('form').addEventListener('submit', (event) => {
    dictionaryDefinition.createDefinition(event);
});
