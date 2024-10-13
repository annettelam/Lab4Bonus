class DictionarySearch {
    constructor() {
        this.searchInput = document.getElementById("searchInput");
        this.responseArea = document.getElementById("responseArea");
    }

    async search() {
        const searchTerm = this.searchInput.value.toLowerCase();

        try {
            const response = await fetch(`http://your_droplet_ip:3000/?word=${searchTerm}`, {  // Replace with actual Droplet IP
                method: 'GET',
            });
            const data = await response.json();

            if (response.ok) {
                if (data.definition) {
                    this.responseArea.innerHTML = `
                    <p>Definition of <span class="response">${searchTerm}</span>: ${data.definition}</p>
                    <p>Total server requests: ${data.requestCount}</p>`;
                } else {
                    this.responseArea.innerHTML = `<p>Error: Definition not found for ${searchTerm}</p>`;
                }
            } else {
                this.responseArea.innerHTML = `<p>Error: ${data.message}</p>`;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
}

const dictionarySearch = new DictionarySearch();
document.querySelector('button').addEventListener('click', () => {
    dictionarySearch.search();
});
