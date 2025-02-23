async function navigateToEditor() {
    const password = prompt('Enter password:');
    if (password === 'Kamalaysayan@2025') {
        window.location.href = 'editor.html';
    } else {
        alert('Incorrect password');
    }
}

function navigateToCustomer() {
    window.location.href = 'customer.html';
}

function openAddImage() {
    document.getElementById('whiteContainer').style.display = 'block';
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
}

async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            document.getElementById('uploadedImage').src = e.target.result;
            document.getElementById('uploadedImageContainer').style.display = 'block';
        }

        reader.readAsDataURL(file);
    }
}

async function markAsDone() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select an image first.');
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Upload failed: ${response.status} - ${errorData.message || response.statusText}`);
        }

        document.getElementById('whiteContainer').style.display = 'none';
        document.getElementById('uploadedImageContainer').style.display = 'none';
        document.getElementById('fileInput').value = '';

        await fetchImages(); // Refresh image list after successful upload

    } catch (error) {
        console.error("Error during upload:", error);
        alert(error.message);
    }
}

async function fetchImages() {
    try {
        const response = await fetch('/images');
        if (!response.ok) {
            throw new Error(`Failed to fetch images: ${response.status}`);
        }
        const images = await response.json();
        const imageList = document.getElementById('imageList');
        imageList.innerHTML = '';

        images.forEach(image => {
            const container = document.createElement('div');
            container.className = 'pink-container';
            container.onclick = () => window.location.href = `image-page-${image.id}.html`;

            const img = document.createElement('img');
            img.src = image.url;
            img.alt = 'Uploaded Image';

            container.appendChild(img);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-button';
            deleteBtn.innerHTML = 'Delete';
            deleteBtn.onclick = async (event) => {
                event.stopPropagation();
                if (confirm("Are you sure you want to delete this image?")) {
                    await deleteImage(image.id);
                    container.remove();
                }
            };

            container.appendChild(deleteBtn);
            imageList.appendChild(container);
        });
    } catch (error) {
        console.error("Error fetching images:", error);
        alert("Failed to load images. Please try again later.");
    }
}

async function deleteImage(imageId) {
    await fetch(`/delete-image/${imageId}`, { method: 'DELETE' });
}

function startQrCodeReader() {
    const video = document.getElementById('preview');
    const canvasElement = document.createElement('canvas');
    const canvas = canvasElement.getContext('2d');
    let scanning = false;

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(function(stream) {
        scanning = true;
        video.setAttribute('playsinline', true);
        video.srcObject = stream;
        video.play();
        requestAnimationFrame(tick);
    });

    function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            if (code) {
                alert(`QR Code detected: ${code.data}`);
                video.srcObject.getTracks().forEach(track => track.stop());
                scanning = false;
            }
        }
        if (scanning) {
            requestAnimationFrame(tick);
        }
    }
}

if (window.location.pathname.endsWith('editor.html')) {
    fetchImages();
}

if (window.location.pathname.endsWith('customer.html')) {
    document.addEventListener('DOMContentLoaded', (event) => {
        startQrCodeReader();
    });
}