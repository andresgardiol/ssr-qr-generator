import QRCode from 'qrcode';
import {PassThrough} from 'stream';

export default async function handler(req, res) {
    console.log(req.url);
    const urlParts = req.url.split('?');
    let text = 'https://simple-qr-generator.vercel.app/';
    if (urlParts[1]) {
        let pair = urlParts[1].split("&");

        let keyValue = pair[0].split("=");
        text = decodeURIComponent(keyValue[1]);

    }
    const qrStream = new PassThrough();
    await QRCode.toFileStream(qrStream, text,
        {
            type: 'png',
            width: 500,
            errorCorrectionLevel: 'M'
        }
    );


    res.writeHead(200, {
        'Content-Type': 'img/png'
    });

    qrStream.pipe(res);
}
