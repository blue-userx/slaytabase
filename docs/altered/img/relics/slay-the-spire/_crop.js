import nodeCanvas from 'canvas';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

let origSize = 256;
let targetSize = 150;

let dn = dirname(fileURLToPath(import.meta.url));
let dir = fs.readdirSync(dn);
for (let imgPath of dir) {
    if (imgPath.endsWith('js')) continue;
    let canvas = nodeCanvas.createCanvas(targetSize, targetSize);
    let ctx = canvas.getContext('2d');
    nodeCanvas.loadImage(`${dn}/${imgPath}`).then(img => {
        ctx.drawImage(img, (targetSize-origSize)/2, (targetSize-origSize)/2);
        const out = fs.createWriteStream(`${dn}/${imgPath}`)
        const stream = canvas.createPNGStream()
        stream.pipe(out)
    })
}