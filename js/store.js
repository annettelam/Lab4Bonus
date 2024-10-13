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
            const response = await fetch('http://your_droplet_ip:3000/', {  // Replace with actual Droplet IP
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
