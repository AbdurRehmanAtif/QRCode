import express from 'express'; // Correctly import express
import QRController from './controllers/QRController.js'; // Import QRController with .js extension

const app = express(); // Instantiate express
const PORT = process.env.PORT || 5020;
const router = express.Router();
const qrController = new QRController(); // Instantiate the QRController


// Define routes
router.get('/', (req, res) => {
    res.send('Welcome to the QR Code generator API!'); // Simple welcome message
});

router.post('/generate-qr', (req, res, next) => {
    qrController.generateSimpleQRCode(req, res, next); // Simple QR code
});
router.post('/whatsapp/qrcode', qrController.generateWhatsAppQRCode.bind(qrController));

// Email QR Codes
router.post('/gmail/qrcode', qrController.generateGmailQRCode.bind(qrController));
router.post('/yahoo/qrcode', qrController.generateYahooQRCode.bind(qrController));

// SMS and Phone QR Codes
router.post('/sms/qrcode', qrController.generateSMSQRCode.bind(qrController));
router.post('/phone/qrcode', qrController.generatePhoneQRCode.bind(qrController));

// WiFi QR Code
router.post('/wifi/qrcode', qrController.generateWiFiQRCode.bind(qrController));

// Social Media QR Codes
router.post('/facebook/qrcode', qrController.generateFacebookQRCode.bind(qrController));
router.post('/twitter/qrcode', qrController.generateTwitterQRCode.bind(qrController));
router.post('/instagram/qrcode', qrController.generateInstagramQRCode.bind(qrController));

// File links
router.post('/image/qrcode', qrController.generateImageQRCode.bind(qrController));
router.post('/video/qrcode', qrController.generateVideoQRCode.bind(qrController));
router.post('/pdf/qrcode', qrController.generatePDFQRCode.bind(qrController));

// Additional QR Codes
router.post('/linkedin/qrcode', qrController.generateLinkedInQRCode.bind(qrController));
router.post('/youtube/qrcode', qrController.generateYouTubeQRCode.bind(qrController));
router.post('/website/qrcode', qrController.generateWebsiteQRCode.bind(qrController));
router.post('/location/qrcode', qrController.generateLocationQRCode.bind(qrController));
router.post('/event/qrcode', qrController.generateEventQRCode.bind(qrController));


router.get('/view', (req, res, next) => {
    qrController.view(req, res, next); // Call the method to generate QR code
});
// Use the router with a prefix
app.use('/qr', router); // Mount the router on the /qr path
// Middleware to parse JSON requests
app.use(express.json())
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
