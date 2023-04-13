import fs from 'fs';

let data = JSON.parse(fs.readFileSync('./docs/data.json'));

for (let c of data.cards) {
    let oldPath = `docs/${c.mod}/${c.color.slice(0,10)}-${c.name.replaceAll(' ', '').replaceAll(':', '-').replaceAll('\'', '').replaceAll('?', '').replaceAll('"', '').replaceAll('/', '')}.png`;
    let newPath = `docs/${c.mod}/${c.id.replaceAll(' ', '').replaceAll(':', '-').replaceAll('\'', '').replaceAll('?', '').replaceAll('"', '').replaceAll('/', '')}.png`;
    if (fs.existsSync(oldPath))
        fs.mvSync(oldPath, newPath);
}

for (let p of data.potions) {
    let oldPath = `docs/${p.mod}/${p.name.replaceAll(' ', '')}.png`;
    let newPath = `docs/${p.mod}/${p.id.replaceAll(' ', '')}.png`;
    if (fs.existsSync(oldPath))
        fs.mvSync(oldPath, newPath);
}