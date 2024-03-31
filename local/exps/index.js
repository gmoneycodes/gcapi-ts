const qrcode = require('qrcode-terminal');
const Gcapi = require("../dist/source/gcapi").default;
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const main = async () => {
    // Prompt user for country code
    rl.question('Enter country code: ', async (countryCode) => {
        const fullCountryCode = countryCode
        // Prompt user for phone number
        rl.question('Enter phone number: ', async (phoneNumber) => {
            const fullPhoneNumber = phoneNumber;

            const gcapi = new Gcapi({
                cookiePath: './cookie.json',
                showQr: false,
                puppeteer: {
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                    ignoreDefaultArgs: ['--disable-extensions'],
                },
            });

            gcapi.on('qrcode', (value) => {
                qrcode.generate(value, { small: true });
            });

            gcapi.on('logged', (logged) => {
                if (logged) {
                    console.log('logged');
                } else {
                    console.log('scan qr code first');
                }
            });

            gcapi.on('error', (error) => {
                console.error(error);
            });

            await gcapi.init();

            // Use the full phone number from the user input
            const tags = await gcapi.find(fullCountryCode, fullPhoneNumber);
            console.log(tags);

            // Close the readline interface
            rl.close();
        });
    });
};

main();
