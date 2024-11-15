import QRCode from 'qrcode'; // Correctly import the QRCode library

class QRController {
    async generateSimpleQRCode(req, res, next) {
        const { text } = req.body;

        // Check if the text parameter is provided
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        try {
            // Generate QR code as a Data URL
            const qrCodeImageUrl = await QRCode.toDataURL(text);
            // URL encode the generated QR code image URL
            const encodedQrCodeImageUrl = encodeURIComponent(qrCodeImageUrl);
            // Send the QR code image URL in the response
            res.status(200).json({ qrCodeImageUrl: encodedQrCodeImageUrl });
        } catch (error) {
            console.error('Error generating QR code:', error);
            res.status(500).json({ error: 'Failed to generate QR code' });
        }
    }

    async generateWhatsAppQRCode(req, res, next) {
        const { countryCode = '', number, message = '', isGroup = 'false' } = req.query;

        // Validate required parameters
        if (!number) {
            return res.status(400).json({ error: 'Number is required' });
        }

        // Create WhatsApp URL based on parameters
        let whatsappUrl;
        try {
            if (isGroup === 'true') {
                // Ensure that number is a valid group invite link code
                if (!/^[A-Za-z0-9]+$/.test(number)) {
                    return res.status(400).json({ error: 'Invalid group link code' });
                }
                whatsappUrl = `https://wa.me/${number}`; // Using number as group link
            } else {
                // Ensure that countryCode is valid and does not include '+'
                const cleanedCountryCode = countryCode.replace(/^\+/, ''); // Remove '+' if it exists
                // Construct the regular WhatsApp message link
                whatsappUrl = `https://wa.me/${cleanedCountryCode}${number}?text=${encodeURIComponent(message)}`;
            }

            // Generate QR code as a Data URL
            const qrCodeImageUrl = await QRCode.toDataURL(whatsappUrl);
            const encodedQrCodeImageUrl = encodeURIComponent(qrCodeImageUrl);
            // Send the QR code image URL in the response
            res.status(200).json({ encodedQrCodeImageUrl });
        } catch (error) {
            console.error('Error generating WhatsApp QR code:', error);
            res.status(500).json({ error: 'Failed to generate QR code' });
        }
    }



    // Method to return HTML for viewing the QR code
    view(req, res, next) {
        const { imageData } = req.query; // Get image data from the query parameter

        if (!imageData) {
            return res.status(400).send('Image data is required');
        }

        // Validate that imageData is a proper Base64 string
        // const isBase64 = (data) => {
        //     const base64Pattern = /^data:image\/(png|jpeg|jpg);base64,[A-Za-z0-9+/]+={0,2}$/;
        //     return base64Pattern.test(data);
        // };

        // if (!isBase64(imageData)) {
        //     return res.status(400).send('Invalid image data format');
        // }

        // Create HTML response to display the QR code
        const htmlResponse = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>QR Code Preview</title>
            </head>
            <body>
                <h1>QR Code Preview</h1>
                <img src="${imageData}" alt="QR Code" />
                <br />
                <a href="/">Go back</a>
            </body>
            </html>
        `;

        // Send the HTML response
        res.status(200).send(htmlResponse);
    }

    async generateGmailQRCode(req, res) {
        const { email, subject, body } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        try {
            const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject || '')}&body=${encodeURIComponent(body || '')}`;
            const qrCodeImageUrl = await QRCode.toDataURL(mailtoUrl);
            res.status(200).json({ qrCodeImageUrl: encodeURIComponent(qrCodeImageUrl) });
        } catch (error) {
            console.error('Error generating Gmail QR code:', error);
            res.status(500).json({ error: 'Failed to generate QR code' });
        }
    }
    async generateWiFiQRCode(req, res) {
        const { ssid, password, encryption } = req.body;

        if (!ssid || !password || !encryption) {
            return res.status(400).json({ error: 'SSID, password, and encryption type are required' });
        }

        try {
            const wifiString = `WIFI:S:${ssid};T:${encryption};P:${password};;`;
            const qrCodeImageUrl = await QRCode.toDataURL(wifiString);
            res.status(200).json({ qrCodeImageUrl: encodeURIComponent(qrCodeImageUrl) });
        } catch (error) {
            console.error('Error generating WiFi QR code:', error);
            res.status(500).json({ error: 'Failed to generate QR code' });
        }
    }
    async generatePhoneQRCode(req, res) {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ error: 'Phone number is required' });
        }

        try {
            const telUrl = `tel:${phone}`;
            const qrCodeImageUrl = await QRCode.toDataURL(telUrl);
            res.status(200).json({ qrCodeImageUrl: encodeURIComponent(qrCodeImageUrl) });
        } catch (error) {
            console.error('Error generating Phone QR code:', error);
            res.status(500).json({ error: 'Failed to generate QR code' });
        }
    }
    async generateSMSQRCode(req, res) {
        const { phone, message } = req.body;

        if (!phone) {
            return res.status(400).json({ error: 'Phone number is required' });
        }

        try {
            const smsUrl = `sms:${phone}?body=${encodeURIComponent(message || '')}`;
            const qrCodeImageUrl = await QRCode.toDataURL(smsUrl);
            res.status(200).json({ qrCodeImageUrl: encodeURIComponent(qrCodeImageUrl) });
        } catch (error) {
            console.error('Error generating SMS QR code:', error);
            res.status(500).json({ error: 'Failed to generate QR code' });
        }
    }
    async generatePDFQRCode(req, res) {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'PDF URL is required' });
        }

        try {
            const qrCodeImageUrl = await QRCode.toDataURL(url);
            res.status(200).json({ qrCodeImageUrl: encodeURIComponent(qrCodeImageUrl) });
        } catch (error) {
            console.error('Error generating PDF QR code:', error);
            res.status(500).json({ error: 'Failed to generate QR code' });
        }
    }

    async generateLinkedInQRCode(req, res) {
        const { profileUrl } = req.body;

        if (!profileUrl) {
            return res.status(400).json({ error: 'LinkedIn profile URL is required' });
        }

        try {
            const qrCodeImageUrl = await QRCode.toDataURL(profileUrl);
            res.status(200).json({ qrCodeImageUrl: encodeURIComponent(qrCodeImageUrl) });
        } catch (error) {
            console.error('Error generating LinkedIn QR code:', error);
            res.status(500).json({ error: 'Failed to generate QR code' });
        }
    }

    async generateLocationQRCode(req, res) {
        const { latitude, longitude } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        try {
            const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
            const qrCodeImageUrl = await QRCode.toDataURL(googleMapsUrl);
            res.status(200).json({ qrCodeImageUrl: encodeURIComponent(qrCodeImageUrl) });
        } catch (error) {
            console.error('Error generating Location QR code:', error);
            res.status(500).json({ error: 'Failed to generate QR code' });
        }
    }

    async generateEventQRCode(req, res) {
        const { title, location, startDate, endDate } = req.body;

        if (!title || !location || !startDate || !endDate) {
            return res.status(400).json({ error: 'Title, location, start date, and end date are required' });
        }

        try {
            const eventString = `BEGIN:VEVENT\nSUMMARY:${title}\nLOCATION:${location}\nDTSTART:${startDate}\nDTEND:${endDate}\nEND:VEVENT`;
            const qrCodeImageUrl = await QRCode.toDataURL(eventString);
            res.status(200).json({ qrCodeImageUrl: encodeURIComponent(qrCodeImageUrl) });
        } catch (error) {
            console.error('Error generating Event QR code:', error);
            res.status(500).json({ error: 'Failed to generate QR code' });
        }
    }

    async generateYouTubeQRCode(req, res) {
        const { videoUrl } = req.body;

        if (!videoUrl) {
            return res.status(400).json({ error: 'YouTube video URL is required' });
        }

        try {
            const qrCodeImageUrl = await QRCode.toDataURL(videoUrl);
            res.status(200).json({ qrCodeImageUrl: encodeURIComponent(qrCodeImageUrl) });
        } catch (error) {
            console.error('Error generating YouTube QR code:', error);
            res.status(500).json({ error: 'Failed to generate QR code' });
        }
    }

    async generateWebsiteQRCode(req, res) {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'Website URL is required' });
        }

        try {
            const qrCodeImageUrl = await QRCode.toDataURL(url);
            res.status(200).json({ qrCodeImageUrl: encodeURIComponent(qrCodeImageUrl) });
        } catch (error) {
            console.error('Error generating Website QR code:', error);
            res.status(500).json({ error: 'Failed to generate QR code' });
        }
    }

    async generateImageQRCode(req, res) {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ error: 'Image URL is required' });
        }

        try {
            const qrCodeImageUrl = await QRCode.toDataURL(imageUrl);
            res.status(200).json({ qrCodeImageUrl: encodeURIComponent(qrCodeImageUrl) });
        } catch (error) {
            console.error('Error generating Image QR code:', error);
            res.status(500).json({ error: 'Failed to generate QR code' });
        }
    }

    async generateVideoQRCode(req, res) {
        const { videoUrl } = req.body;

        if (!videoUrl) {
            return res.status(400).json({ error: 'Video URL is required' });
        }

        try {
            const qrCodeImageUrl = await QRCode.toDataURL(videoUrl);
            res.status(200).json({ qrCodeImageUrl: encodeURIComponent(qrCodeImageUrl) });
        } catch (error) {
            console.error('Error generating Video QR code:', error);
            res.status(500).json({ error: 'Failed to generate QR code' });
        }
    }

    async generateFacebookQRCode(req, res) {
        const { profileUrl } = req.body;

        if (!profileUrl) {
            return res.status(400).json({ error: 'Facebook profile URL is required' });
        }

        try {
            const qrCodeImageUrl = await QRCode.toDataURL(profileUrl);
            res.status(200).json({ qrCodeImageUrl: encodeURIComponent(qrCodeImageUrl) });
        } catch (error) {
            console.error('Error generating Facebook QR code:', error);
            res.status(500).json({ error: 'Failed to generate QR code' });
        }
    }

    async generateTwitterQRCode(req, res) {
        const { profileUrl } = req.body;

        if (!profileUrl) {
            return res.status(400).json({ error: 'Twitter profile URL is required' });
        }

        try {
            const qrCodeImageUrl = await QRCode.toDataURL(profileUrl);
            res.status(200).json({ qrCodeImageUrl: encodeURIComponent(qrCodeImageUrl) });
        } catch (error) {
            console.error('Error generating Twitter QR code:', error);
            res.status(500).json({ error: 'Failed to generate QR code' });
        }
    }

    async generateInstagramQRCode(req, res) {
        const { profileUrl } = req.body;

        if (!profileUrl) {
            return res.status(400).json({ error: 'Instagram profile URL is required' });
        }

        try {
            const qrCodeImageUrl = await QRCode.toDataURL(profileUrl);
            res.status(200).json({ qrCodeImageUrl: encodeURIComponent(qrCodeImageUrl) });
        } catch (error) {
            console.error('Error generating Instagram QR code:', error);
            res.status(500).json({ error: 'Failed to generate QR code' });
        }
    }

    async generateYahooQRCode(req, res) {
        const { email, subject, body } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        try {
            const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject || '')}&body=${encodeURIComponent(body || '')}`;
            const qrCodeImageUrl = await QRCode.toDataURL(mailtoUrl);
            res.status(200).json({ qrCodeImageUrl: encodeURIComponent(qrCodeImageUrl) });
        } catch (error) {
            console.error('Error generating Yahoo QR code:', error);
            res.status(500).json({ error: 'Failed to generate QR code' });
        }
    }
};





export default QRController;
