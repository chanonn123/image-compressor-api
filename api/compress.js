import sharp from 'sharp';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Only POST requests are allowed');
    }

    try {
        const chunks = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks); // this is the raw base64 string
        const base64 = buffer.toString();
        const imageBuffer = Buffer.from(base64, 'base64');

        const output = await sharp(imageBuffer)
            .resize({ width: 600 })
            .jpeg({ quality: 70 })
            .toBuffer();

        res.setHeader('Content-Type', 'image/jpeg');
        res.status(200).send(output);
    } catch (err) {
        console.error('[Compression Error]', err.message);
        res.status(500).send('Compression failed');
    }
}

export const config = {
    api: {
        bodyParser: false // 🔑 must be false to get raw body
    }
};
