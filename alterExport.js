import fs from 'fs';
import canvas from 'canvas';
import { diffWords } from 'diff';
import extraData from './extraItems.js';

const exportImages = process.argv.includes('-images');

const width = 678;
const height = 874;

function useExtraData(data, dataToUse) {
    for (let category in dataToUse.add)
        data[category] = data.hasOwnProperty(category) ? [...data[category], ...dataToUse.add[category]] : dataToUse.add[category]; //add the extra items to the category (or create it if it doesnt exist)

    for (let category in dataToUse.edit)
        for (let editData of dataToUse.edit[category]) {
            let item = data[category].find(i => Object.keys(editData.where).filter(key => i[key] != editData.where[key]).length == 0);
            for (let i in editData.to) {
                if (typeof editData.to[i] == 'string')
                    item[i] = editData.to[i];
                else
                    item[i] = editData.to[i](item[i]);
            }
        }
}

(async () => {
    //load data
    console.log('Starting...')
    const data = JSON.parse(fs.readFileSync('docs/export/items.json', 'utf-8'));

    useExtraData(data, extraData.pre);

    //alter cards
    let cards = data.cards;
    let newCards = [];
    for (let c of cards) {
        if (c.name.includes('+')) continue; //skip upgraded cards

        let finish;
        let finished = new Promise(res => finish = res);

        let up = cards.find(e => e.name == c.name+'+' && e.color == c.color); //find upgraded version of card

        //create image of card next to its upgrade
        let canv, ctx;
        if (exportImages) {
            canv = canvas.createCanvas(width * 2, height); //double-width canvas if there is an upgrade
            ctx = canv.getContext('2d');
        }
        let cardPath = `${c.color.slice(0,10)}-${c.name.replaceAll(' ', '').replaceAll(':', '-').replaceAll('\'', '').replaceAll('?', '')}`;
        let imgPath = `docs/export/${c.mod == '' ? 'slay-the-spire' : c.mod}/card-images/${cardPath}`;
        if (exportImages) {
            ctx.drawImage(await canvas.loadImage(imgPath+'.png'), 0, 0);
            if (up == undefined)
                ctx.drawImage(await canvas.loadImage(imgPath.replace('export', 'betaartexport')+'.png'), width, 0);
        }
        if (up != undefined) {
            if (exportImages)
                ctx.drawImage(await canvas.loadImage(up.hasOwnProperty('imgPath') ? up.imgPath+'.png' : (imgPath.replace('export', 'betaartexport')+'Plus.png')), width, 0);

            //update card to include numbers from upgrade
            if (c.cost != up.cost) c.cost = `${c.cost} (${up.cost})`;
            let diff = diffWords(c.description, up.description);
            c.description = '';
            for (let i in diff) {
                i = Number(i);
                let word = diff[i];
                if (!word.hasOwnProperty('added'))
                    c.description += word.value;
                else if (word.added)
                    c.description += ` (${word.value.includes(':') ? ' ' : ''}${word.value.replace('\n', '')}${word.value.includes(':') ? ' ' : ''})${word.value.includes('\n') ? '\n' : ''}${word.value.endsWith(' ') ? ' ' : ''}`;
                else if (word.removed) {
                    if (!diff.hasOwnProperty(i+1) || !diff[i+1].added)
                        c.description += `${word.value.startsWith('\n') ? '\n' : ''}~~- ${word.value.replaceAll('\n', '')} -~~${word.value.endsWith('\n') ? '\n' : ' '}`;
                    else
                        c.description += word.value;
                }
            }
            c.description = c.description.replaceAll('([E]', '( [E]');
        }
        if (exportImages) {
            //save image
            let out = fs.createWriteStream(`docs/altered/img/cards/${cardPath}.png`);
            canv.createPNGStream().pipe(out);
            out.on('finish', () => finish());
            console.log(`exported ${cardPath}`);
        } else finish()

        newCards.push(c);
        await finished;
    }
    data.cards = newCards;

    //add new data
    useExtraData(data, extraData.post);
    
    for (let i in data.bosss) {
        let boss = data.bosss[i];
        boss.name = boss.name+' '+boss.act;
        boss.mod = 'downfall';
        boss.description = `Act ${boss.act} Boss\n\n**${boss.buff[0]}** - ${boss.buff[1]}\n\n**Cards**: ${boss.cards.join(', ')}\n\n**Relics**: ${boss.relics.join(', ')}${boss.hasOwnProperty('customCards') ? `\n\n**Unique Cards**:\n${boss.customCards.map(c => `${c[0]} - ${c[1]}`).join('\n')}` : ''}`;
        data.bosss[i] = boss;
    }
    
    for (let i in data.events) {
        let event = data.events[i];
        let desc = event.options.map(o =>`w/[${o[0]}${o[1] == null ? '' : ` n/(${o[1]})`}w/] ${o[2]}`).join('\n');
        event.description = desc.replaceAll('w/', '').replaceAll('g/', '').replaceAll('r/', '').replaceAll('n/', '').replaceAll('a/', '').replaceAll('y/', '');
        event.colouredDesc = desc.replaceAll('w/', '[2;37m').replaceAll('g/', '[2;32m').replaceAll('r/', '[2;31m').replaceAll('n/', '[0;2m').replaceAll('a/', '[2;34m').replaceAll('y/', '[2;33m');
        event.character = event.hasOwnProperty('character') ? event.character : '';
        delete event.options;
        event.campaign = event.mod == '' ? 'standard' : event.mod;
        data.events[i] = event;
    }
    
    //save new data
    fs.writeFileSync('docs/altered/items.json', JSON.stringify(data));
    fs.writeFileSync('docs/altered/itemsFormatted.json', JSON.stringify(data, null, 4));
    console.log('\nDone!');
})();