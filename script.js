// Select necessary DOM elements
const input = document.querySelector('#input');
const reselts = document.querySelector('.reselts');
const categoryButtons = document.querySelectorAll('.category-btn');
const logo = document.querySelector('.logo'); // Selecting the logo element

// Function to scroll to the image results section
const scrollToResults = () => {
    reselts.scrollIntoView({ behavior: 'smooth' });
};

// Function to programmatically download an image
const downloadImage = async (url, filename) => {
    try {
        // Fetch the image as a blob
        const response = await fetch(url);
        const blob = await response.blob();
        
        // Create a temporary URL for the blob
        const blobUrl = window.URL.createObjectURL(blob);
        
        // Create a temporary anchor element
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        
        // Append the anchor to the body and click it to start the download
        document.body.appendChild(a);
        a.click();
        
        // Remove the anchor from the body
        document.body.removeChild(a);
        
        // Revoke the blob URL to release memory
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Failed to download image:', error);
    }
};

// Function to fetch and display images based on category
const fetchImagesByCategory = async (category) => {
    try {
        const url = `https://api.unsplash.com/search/photos/?page=1&query=${category}&client_id=20XUgpS97eJOnP484SVASAwbYy-ABwoMDDuuG-8B3E8`;
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.results) {
            reselts.innerHTML = "";
            data.results.forEach((result) => {
                let imgUrl = result.urls.small; // Use smaller version of the image for display
                let imgDownloadUrl = result.urls.full; // Use full version of the image for download
                let imgAlt = result.alt_description || category; // Fallback to category if alt_description is not available

                // Create a unique filename for each download
                let filename = `${imgAlt.replace(/\s+/g, '_')}.jpg`;

                reselts.innerHTML += `
                    <div class="row">
                        <img src="${imgUrl}" alt="${imgAlt}">
                        <button class="download-btn" onclick="downloadImage('${imgDownloadUrl}', '${filename}')">Download</button>
                    </div>
                `;
            });

            // Scroll to the results section
            scrollToResults();
        }
    } catch (error) {
        console.error(`Failed to fetch images for category '${category}':`, error);
    }
};

// Event listener for category buttons
categoryButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const category = button.dataset.category;
        await fetchImagesByCategory(category);
    });
});

// Event listener for Enter key press in search input
input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent default form submission behavior
        await fetchImagesByCategory(input.value.trim());
    }
});

// Event listener for clicking on the logo to refresh the page
logo.addEventListener('click', () => {
    location.reload(); // Reloads the current page
});

// Function to load random images on page load
const loadRandomImages = async () => {
    const randomQueries = ['butterflies', 'cars', 'nature', 'space', 'mountains'];
    const randomQuery = randomQueries[Math.floor(Math.random() * randomQueries.length)];
    await fetchImagesByCategory(randomQuery);
};

// Load random images only when the page is fully loaded
window.addEventListener('load', loadRandomImages);
