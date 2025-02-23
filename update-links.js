<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editor</title>
    <style>
        .pink-container {
            background-color: pink;
            padding: 10px;
            margin: 5px;
            display: inline-block;
            cursor: pointer;
        }

        #done-button {
            display: none;
        }

        #link-input {
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Editor Homepage</h2>
        <div id="links-display"></div>
        <button onclick="showInput()">Add Link</button>
        <input type="text" id="link-input" placeholder="Paste Google Drive link">
        <button id="done-button" onclick="addLink()">Done</button>
    </div>

    <script>
        const linkInput = document.getElementById('link-input');
        const linksDisplay = document.getElementById('links-display');
        const doneButton = document.getElementById('done-button');
        let links = [];

        function showInput() {
            linkInput.style.display = 'block';
            doneButton.style.display = 'block';
        }

        function addLink() {
            const link = linkInput.value.trim();
            if (!link) {
                alert("Please enter a valid link.");
                return;
            }

            fetch('/.netlify/functions/update-links', {
                method: 'POST',
                body: JSON.stringify({ link: link }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(newLink => {
                links.push(newLink);
                displayLinks(); // Update display
                const broadcast = new BroadcastChannel('newLink');
                broadcast.postMessage(newLink);
                linkInput.value = '';
                linkInput.style.display = 'none';
                doneButton.style.display = 'none';
            })
            .catch(error => console.error("Error adding link:", error));
        }

        function displayLinks() {
            linksDisplay.innerHTML = ''; // Clear previous links

            links.forEach((linkObj, index) => {
                const linkContainer = document.createElement('div');
                linkContainer.className = 'pink-container';
                linkContainer.textContent = `${index + 1}: ${linkObj.link}`; // Display the actual link with number
                linksDisplay.appendChild(linkContainer);
            });
        }

        // Fetch existing links on load
        window.addEventListener('DOMContentLoaded', () => {
            fetchLinks();
        });

        function fetchLinks() {
            fetch('/.netlify/functions/update-links', { method: 'GET' })
                .then(response => response.json())
                .then(data => {
                    links = data; // Store fetched links in the array
                    displayLinks(); // Display fetched links
                })
                .catch(error => console.error("Error fetching links:", erro
