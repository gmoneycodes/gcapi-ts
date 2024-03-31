const endpoint = 'http://localhost:3000/generateQR';

document.getElementById('phoneForm')!.addEventListener('submit', async (event) => {
    event.preventDefault();

    const countryCode = (document.getElementById('countryCode') as HTMLSelectElement).value;
    const phoneNumber = (document.getElementById('phoneNumber') as HTMLInputElement).value;
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phoneNumber: fullPhoneNumber }),
        });

        const data = await response.json();

        // Handle the response
        console.log(data);
        // You might want to display the QR code or a message here
    } catch (error) {
        console.error('Error:', error);
    }
});
