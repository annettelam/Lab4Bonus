// client/js/search.js
document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const word = document.getElementById('search-word').value.trim();

    // Simple input validation
    if (!word || /\d/.test(word)) {
        alert('Please enter a valid word (no numbers).');
        return;
    }

    fetch(`https://yourDomainName2.wyz/api/definitions/?word=${encodeURIComponent(word)}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('search-result').innerText = JSON.stringify(data, null, 2);
        })
        .catch(error => console.error('Error:', error));
});
