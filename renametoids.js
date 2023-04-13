import fs from 'fs';

let data = JSON.parse(fs.readFileSync('./docs/data.json'));

for (let c of data.cards) {
    let oldPath = `./docs/${c.mod}/cards/${c.color.slice(0,10)}-${c.name.replaceAll(' ', '').replaceAll(':', '-').replaceAll('\'', '').replaceAll('?', '').replaceAll('"', '').replaceAll('/', '')}.png`;
    let newPath = `./docs/${c.mod}/cards/${c.id.replaceAll(' ', '').replaceAll(':', '-').replaceAll('\'', '').replaceAll('?', '').replaceAll('"', '').replaceAll('/', '')}.png`;
    if (fs.existsSync(oldPath))
        fs.renameSync(oldPath, newPath);
}

for (let p of data.potions) {
    let oldPath = `./docs/${p.mod}/potions/${p.name.replaceAll(' ', '')}.png`;
    let newPath = `./docs/${p.mod}/potions/${p.id.replaceAll(' ', '').replaceAll(':', '-')}.png`;
    if (fs.existsSync(oldPath))
        fs.renameSync(oldPath, newPath);
}