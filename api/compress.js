import sharp from 'sharp';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Only POST allowed');
    }

    try {
        const buffer = Buffer.from(req.body, 'base64');

        const output = await sharp(buffer)
            .resize({ width: 600 }) // resize width
            .jpeg({ quality: 70 })  // compress to JPEG
            .toBuffer();

        res.setHeader('Content-Type', 'image/jpeg');
        res.status(200).send(output);
    } catch (err) {
        console.error(err);
        res.status(500).send('Compression failed');
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb'
        }
    }
};
