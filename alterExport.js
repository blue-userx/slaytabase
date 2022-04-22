import fs from 'fs';
import canvas from 'canvas';
import { diffWords } from 'diff';

const width = 678;
const height = 874;

(async () => {
    //load data
    console.log('Starting...')
    const data = JSON.parse(fs.readFileSync('docs/items.json', 'utf-8'));

    //alter cards
    let cards = data.cards;
    let newCards = [];
    for (let c of cards) {
        if (c.name.includes('+')) continue; //skip upgraded cards
        console.log('\n\n'+c.name);

        let finish;
        let finished = new Promise(res => finish = res);

        let up = cards.find(e => e.name == c.name+'+'); //find upgraded version of card

        //create image of card next to its upgrade
        let canv = canvas.createCanvas(width * (up == undefined ? 1 : 2), height); //double-width canvas if there is an upgrade
        let ctx = canv.getContext('2d');
        let cardPath = `${c.color.slice(0,10)}-${c.name.replaceAll(' ', '').replaceAll(':', '-').replaceAll('\'', '').replaceAll('?', '')}`;
        let imgPath = `docs/${c.mod == '' ? 'slay-the-spire' : c.mod}/card-images/${cardPath}`;
        ctx.drawImage(await canvas.loadImage(imgPath+'.png'), 0, 0);
        if (up != undefined) {
            ctx.drawImage(await canvas.loadImage(imgPath+'Plus.png'), width, 0);

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
                    c.description += ` (${word.value.replace('\n', '')})${word.value.includes('\n') ? '\n' : ''}`;
                else if (word.removed) {
                    if (!diff.hasOwnProperty(i+1) || !diff[i+1].added)
                        c.description += `${(word.value.endsWith('\n') ? word.value.replace('\n', '') : word.value).replace('.', '').replace(' ', '')} (not ${word.value.replace('\n', '').replace('.', '').replace(' ', '')})${word.value.includes('.') ? '.' : ''}${word.value.endsWith(' ') ? ' ' : ''}${word.value.endsWith('\n') ? '\n' : ''}`;
                    else
                        c.description += word.value;
                }
            }
            c.description = c.description.replaceAll('([E]', '( [E]');
            console.log('\n'+c.description);
        }
        //save image
        let out = fs.createWriteStream(`docs/altered/img/cards/${cardPath}.png`);
        canv.createPNGStream().pipe(out);
        out.on('finish', () => finish());

        newCards.push(c);
        await finished;
    }
    data.cards = newCards;

    //add new data
    const extraData = JSON.parse(fs.readFileSync('extraItems.json', 'utf-8'));
    for (let category in extraData)
        data[category] = data.hasOwnProperty(category) ? [...data[category], ...extraData[categoy]] : extraData[category]; //add the extra items to the category (or create it if it doesnt exist)
    
    //save new data
    fs.writeFileSync('docs/altered/items.json', JSON.stringify(data));
    console.log('\nDone!');
})();