// This file is to manually serve the build folder on Heroku.
// This is specifically to get around the issue of the
// plugin not rendering with a react router link.
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Send e2e-settings instead of the default settings when e2e testing
console.log('frontend (serve-build.js), e2e-testing: ', process.env.E2E_TESTING);
if (process.env.E2E_TESTING) {
    app.get('/settings.json', function (req, res) {
        res.sendFile(path.resolve('./public/e2e-settings.json'));
    });
    console.log('Replaced default settings.json with e2e-settings.json');
}

app.use(express.static(path.join(__dirname, '/build')));

// We direct any GET request to the index.html to handle,
// to avoid Heroku returning a 404 when we try to load the data page.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log('[frontend - serve-build.js] Listening on ' + PORT);
});
