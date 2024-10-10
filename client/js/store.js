// client/js/store.js
document.getElementById('store-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const word = document.getElementById('word').value.trim();
    const definition = document.getElementById('definition').value.trim();

    // Simple input validation
    if (!word || !definition || /\d/.test(word)) {
        alert('Please enter a valid word and definition (no numbers).');
        return;
    }

    fetch('https://yourDomainName2.wyz/api/definitions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ word, definition })
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('response').innerText = JSON.stringify(data, null, 2);
        })
        .catch(error => console.error('Error:', error));
});
