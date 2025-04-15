// src/rfidScraper.js
const puppeteer = require('puppeteer');

async function getLatestScan() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto('http://nm-rfid-1.rit.edu:8001/', { waitUntil: 'networkidle0' });

        // Wait a few seconds for a scan to appear
        await page.waitForSelector('#messages');

        // Get the content of the messages box
        const scanData = await page.$eval('#messages', el => el.textContent.trim());

        await browser.close();

        // Optional: split by newlines and return the latest line
        const lines = scanData.split('\n');
        const lastLine = lines[lines.length - 1].trim();

        return lastLine;
    } catch (err) {
        console.error('❌ Scraper error:', err.message);
        await browser.close();
        return null;
    }
}

module.exports = { getLatestScan };
