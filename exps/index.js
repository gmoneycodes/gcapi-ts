const qrcode = require('qrcode-terminal')
const Gcapi = require("../dist/source/gcapi").default;

const main = async () => {
    const gtc= new Gcapi({
        cookiePath: './cookie.json',
        showQr: false,
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            ignoreDefaultArgs: ['--disable-extensions'],
        },
    })

    gtc.on('qrcode', (value) => {
        qrcode.generate(value, { small: true })
    })

    gtc.on('logged', (logged) => {
        if (logged) {
            console.log('logged')
        } else {
            console.log('scan qr code first')
        }
    })

    gtc.on('error', (error) => {
        console.error(error)
    })

    await gtc.init()

    const tags = await gtc.find('ID', '628158043821') // just random phone number
    console.log(tags)
}

main()