<!DOCTYPE html>
<html>
<head>
    <title>Editor</title>
    <style>
        /* Existing styles */
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

        /* Added styles to ensure elements are visible */
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
    <button id="done-button" onclick="doneAdding()">Done</button>
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

    function doneAdding() {
        const link = linkInput.value;

        if (link) {
            // Send the new link to the server
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
                displayLinks();
                // Broadcast the new link to the customer page
                const broadcast = new BroadcastChannel('newLink');
                broadcast.postMessage(links);
                linkInput.value = '';
                linkInput.style.display = 'none';
                doneButton.style.display = 'none';
            })
            .catch(error => console.error("Error adding link:", error));
        } else {
            alert('Please enter a link.');
        }
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
                links =
