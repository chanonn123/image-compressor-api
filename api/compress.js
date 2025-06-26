import sharp from 'sharp';
import axios from 'axios';

export const config = {
    api: {
        bodyParser: true
    }
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Only POST allowed');
    }

    const { url } = req.body;
    if (!url) return res.status(400).send('Missing image URL');

    try {
        const imageRes = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: req.headers.authorization
                ? { Authorization: req.headers.authorization }
                : {}
        });

        const inputBuffer = Buffer.from(imageRes.data);

        const outputBuffer = await sharp(inputBuffer)
            .rotate()
            .resize({ width: 500 })
            .jpeg({ quality: 70 })
            .toBuffer();

        res.setHeader('Content-Type', 'image/jpeg');
        res.status(200).send(outputBuffer);
    } catch (err) {
        console.error('Compression failed:', err.message);
        res.status(500).send('Compression failed');
    }
}
