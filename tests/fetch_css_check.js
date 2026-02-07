const https = require('https');

const url = 'https://storal.fr/products/kissimy';

https.get(url, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        const regex = /_next\/static\/css\/[^"]+\.css/g;
        const matches = data.match(regex);
        console.log("Status Code:", res.statusCode);
        if (matches) {
            console.log("CSS Files found:", matches);
            // Check the first one
            const cssUrl = 'https://storal.fr/' + matches[0];
            console.log("Checking CSS URL:", cssUrl);
            
            https.get(cssUrl, (cssRes) => {
                console.log("CSS Status Code:", cssRes.statusCode);
            }).on('error', (e) => {
                console.error("Error fetching CSS:", e);
            });

        } else {
            console.log("No CSS file link found.");
            // Print a snippet of HTML to debug if needed
            console.log("HTML Snippet:", data.substring(0, 500));
        }
    });

}).on('error', (err) => {
    console.error("Error fetching page:", err.message);
});
