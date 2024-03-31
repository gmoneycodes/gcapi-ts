const puppeteer = require('puppeteer');
const axios = require('axios');

module.exports = async (req, res) => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
    });
    const page = await browser.newPage();
    await page.goto('https://web.getcontacts.com/get-qr-code', { waitUntil: 'networkidle0' });

    // Assuming the QR code is directly accessible as an image
    const qrCodeImageUrl = await page.evaluate(() => document.querySelector('img').src);

    await browser.close();

    // Fetch and return the QR code image directly
    const response = await axios.get(qrCodeImageUrl, { responseType: 'arraybuffer' });
    res.setHeader('Content-Type', 'image/png');
    res.send(response.data);
};