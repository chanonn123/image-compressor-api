import sharp from 'sharp';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Only POST requests are allowed');
    }

    try {
        // Read raw base64 body from Google Apps Script
        const chunks = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        const base64 = buffer.toString();
        const imageBuffer = Buffer.from(base64, 'base64');

        // Process image using sharp
        const outputBuffer = await sharp(imageBuffer)
            .rotate() // auto-rotate using EXIF
            .resize({ width: 500 }) // resize to fit single page
            .toFormat('jpeg', { quality: 70 }) // convert to JPEG
            .toBuffer();

        res.setHeader('Content-Type', 'image/jpeg');
        res.status(200).send(outputBuffer);
    } catch (error) {
        console.error('[Compression Error]', error);
        res.status(500).send('Compression failed');
    }
}
