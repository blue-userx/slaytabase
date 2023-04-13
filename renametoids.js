import fs from 'fs';

let data = JSON.parse(fs.readFileSync('./docs/data.json'));
let oldRedirects = [[],[]];

for (let c of data.cards) {
    let modPath = `./docs/${c.mod}/`
    let oldPath = `cards/${c.color.slice(0,10)}-${c.name.replaceAll(' ', '').replaceAll(':', '-').replaceAll('\'', '').replaceAll('?', '').replaceAll('"', '').replaceAll('/', '')}.png`;
    let newPath = `cards/${c.id.replaceAll(' ', '').replaceAll(':', '-').replaceAll('\'', '').replaceAll('?', '').replaceAll('"', '').replaceAll('/', '')}.png`;
    if (fs.existsSync(modPath+oldPath))
        fs.renameSync(modPath+oldPath, modPath+newPath);
    let wikiPath = modPath+'index.html';
    fs.writeFileSync(wikiPath, fs.readFileSync(wikiPath, 'utf-8').replaceAll(oldPath, newPath));
    oldRedirects[0].push(encodeURI(oldPath));
    oldRedirects[1].push(encodeURI(newPath));
}

for (let p of data.potions) {
    let modPath = `./docs/${p.mod}/`
    let oldPath = `potions/${p.name.replaceAll(' ', '')}.png`;
    let newPath = `potions/${p.id.replaceAll(' ', '').replaceAll(':', '-')}.png`;
    if (fs.existsSync(modPath+oldPath))
        fs.renameSync(modPath+oldPath, modPath+newPath);
    let wikiPath = modPath+'index.html';
    fs.writeFileSync(wikiPath, fs.readFileSync(wikiPath, 'utf-8').replaceAll(oldPath, newPath));
    oldRedirects[0].push(encodeURI(oldPath));
    oldRedirects[1].push(encodeURI(newPath));
}

fs.writeFileSync('./oldredirects.json', JSON.stringify(oldRedirects));