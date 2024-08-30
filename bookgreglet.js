javascript:(function() {
    // Create a container for overlays
    var overlayContainer = document.createElement('div');
    overlayContainer.style.position = 'fixed';
    overlayContainer.style.top = '0';
    overlayContainer.style.left = '0';
    overlayContainer.style.width = '100%';
    overlayContainer.style.height = '100%';
    overlayContainer.style.backgroundColor = 'rgba(0,0,0,0.8)';
    overlayContainer.style.color = '#fff';
    overlayContainer.style.zIndex = '9999';
    overlayContainer.style.fontFamily = 'Arial, sans-serif';
    overlayContainer.style.overflow = 'auto';
    document.body.appendChild(overlayContainer);

    // Title overlay
    var title = document.createElement('div');
    title.innerText = 'AARONS STOCK EVALUATION BOOKMARK';
    title.style.color = 'white';
    title.style.fontSize = '24px';
    title.style.textAlign = 'center';
    title.style.margin = '20px';
    title.style.backgroundImage = 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)';
    title.style.webkitBackgroundClip = 'text';
    title.style.webkitTextFillColor = 'transparent';
    overlayContainer.appendChild(title);

    // Create a function to extract the ticker symbol from the page source
    function extractTickerSymbol() {
        // This example assumes the ticker symbol is in a meta tag
        var metaTags = document.getElementsByTagName('meta');
        for (var i = 0; i < metaTags.length; i++) {
            if (metaTags[i].name === 'ticker') {
                return metaTags[i].content;
            }
        }
        return null;
    }

    // Get the ticker symbol
    var tickerSymbol = extractTickerSymbol();
    if (!tickerSymbol) {
        tickerSymbol = prompt('Ticker symbol not found. Please enter it manually:');
    }

    // Fetch stock history
    var apiKey = '1234abc';
    var apiUrl = 'https://api.investorsfasttrack.com/stocks/history?ticker=' + encodeURIComponent(tickerSymbol) + '&apikey=' + apiKey;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Create the overlay box to display the information
            var infoBox = document.createElement('div');
            infoBox.style.backgroundColor = 'white';
            infoBox.style.color = 'green';
            infoBox.style.padding = '10px';
            infoBox.style.margin = '20px';
            infoBox.style.borderRadius = '5px';
            infoBox.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
            infoBox.innerText = JSON.stringify(data, null, 2);
            overlayContainer.appendChild(infoBox);

            // Add ChatGPT link
            var chatGptLink = document.createElement('a');
            chatGptLink.href = 'https://chatgpt.com';
            chatGptLink.target = '_blank';
            chatGptLink.style.display = 'block';
            chatGptLink.style.color = 'white';
            chatGptLink.style.textAlign = 'center';
            chatGptLink.style.margin = '20px';
            chatGptLink.innerText = 'Visit ChatGPT for Analysis';
            overlayContainer.appendChild(chatGptLink);

            // Handle scrolling
            window.onscroll = function() {
                document.documentElement.scrollTop = document.documentElement.scrollHeight;
            };
        })
        .catch(error => {
            console.error('Error fetching stock history:', error);
        });
})();
