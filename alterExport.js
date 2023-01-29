import fs, { mkdir } from 'fs';
import canvas from 'canvas';
import { diffWords } from 'diff';
//import compressImages from 'compress-images';
import extraData from './extraItems.js';
import pathLib from 'path';
import { execFile } from 'child_process';


const copyRecursiveSync = function(src, dest) {
    var exists = fs.existsSync(src);
    var stats = exists && fs.statSync(src);
    var isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
      fs.mkdirSync(dest);
      fs.readdirSync(src).forEach(function(childItemName) {
        copyRecursiveSync(pathLib.join(src, childItemName),
          pathLib.join(dest, childItemName));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
};

const exportImages = !process.argv.includes('--no-images');
const betaPath = process.argv.includes('--betaless') ? 'export' : 'betaartexport';

const width = 678;
const height = 874;

const origRelicSize = 256;
const targetRelicSize = 150;

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

canvas.loadImageOld = canvas.loadImage;
canvas.loadImage = async path => {
    return await canvas.loadImageOld('data:image/png;base64,'+Buffer.from(fs.readFileSync(path)).toString('base64'));
}

async function exportMod(modPath){
    //load data
    console.log(`Starting export of ${modPath}...`);
    let gameDataPath = `gamedata/export/${modPath}/`;
    const data = JSON.parse(fs.readFileSync(`${gameDataPath}items.json`, 'utf-8'));
    if (!data.hasOwnProperty('mod')) {
        data.mod = {
            "name": "Slay the Spire",
            "version": "2.3.4",
            "authors": ["Mega Crit"],
            "credits": "",
            "description": "",
            "mts_version": "3.15.0",
            "sts_version": "12-22-2020",
            "dependencies": [],
            "optional_dependencies": []
        };
    }

    data.mods = [data.mod];
    delete data.mod;
    let mod = data.mods[0].name;
    for (let i of Object.keys(data).filter(n => n != 'mods'))
        for (let j of data[i])
            j.mod = mod;
    let path = `docs/${mod}/`;
    if (exportImages && fs.existsSync(path)) fs.rmSync(path, { recursive: true, force: true });
    if (!fs.existsSync(path)) fs.mkdirSync(path);

    if (extraData.hasOwnProperty(mod))
        useExtraData(data, extraData[mod].pre);

    //alter cards
    console.log(`Combining cards...`);
    let cards = data.cards;
    let newCards = [];
    if (!fs.existsSync(`${path}cards`)) fs.mkdirSync(`${path}cards`);
    let n = 0;
    for (let c of cards) {
        n++;
        if (newCards.find(oc => oc.id == c.id && oc.name == c.name) != undefined) continue; //skip duplicate cards (happens massively with statuses for some reason)
        if (c.name.includes('+')) continue; //skip upgraded cards
        if (c.name.endsWith('*')) continue; //skip alternate upgrades of cards

        let finish;
        let finished = new Promise(res => finish = res);

        let up = cards.find(e => e.name == c.name+'+' && e.color == c.color); //find upgraded version of card
        let altUp = cards.find(e => e.name == c.name+'*' && e.color == c.color); //find upgraded version of card

        //create image of card next to its upgrade
        let canv, ctx;
        if (exportImages) {
            canv = canvas.createCanvas(width * (altUp != undefined ? 3 : 2), height); //double-width canvas if there is an upgrade
            ctx = canv.getContext('2d');
        }
        let cardPath = `${c.color.slice(0,10)}-${c.name.replaceAll(' ', '').replaceAll(':', '-').replaceAll('\'', '').replaceAll('?', '').replaceAll('"', '').replaceAll('/', '')}`;
        let imgPath = `${gameDataPath}card-images/${cardPath}`;
        if (exportImages) {
            ctx.drawImage(await canvas.loadImage(imgPath+'.png'), 0, 0);
            if (up == undefined)
                ctx.drawImage(await canvas.loadImage(imgPath.replace('export', betaPath)+'.png'), width, 0);
        }
        if (up != undefined) {
            if (exportImages)
                ctx.drawImage(await canvas.loadImage(up.hasOwnProperty('imgPath') ? up.imgPath+'.png' : (imgPath.replace('export', betaPath)+'Plus.png')), width, 0);

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
            if (altUp != undefined) {
                if (exportImages)
                    ctx.drawImage(await canvas.loadImage(up.hasOwnProperty('imgPath') ? altUp.imgPath+'.png' : (imgPath.replace('export', betaPath)+'Star.png')), width*2, 0);
    
                //update card to include numbers from upgrade
                if (c.cost != altUp.cost) c.cost += ` (alt: ${altUp.cost})`;
                c.altDescription = altUp.description.replaceAll('([E]', '( [E]');
            }
        } else {
            let multiUps = cards.filter(e => c.name != '' && e.name.startsWith(c.name) && e.name != c.name && e.name.includes('+') && !e.name.endsWith('+') && e.color == c.color); //find multi upgraded versions of card
            if (multiUps.length > 0) {
                let i = 0;
                let size = Math.ceil(Math.sqrt(multiUps.length));
                if (exportImages) {
                    ctx.clearRect(width, 0, width, height);
                    for (let multiUp of multiUps)
                        ctx.drawImage(await canvas.loadImage(multiUp.hasOwnProperty('imgPath') ? multiUp.imgPath+'.png' : (imgPath.replace('export', betaPath)+`Plus${multiUp.name[multiUp.name.length-1]}.png`)), width+(i%size)*(width/size), Math.floor(i++/size)*(height/size), width/size, height/size);
                }
                let diffs = multiUps.map(multiUp => diffWords(c.description, multiUp.description));
                let diff = diffs[0];
                c.description = '';
                for (let i in diff) {
                    i = Number(i);
                    let word = diff[i];
                    if (!word.hasOwnProperty('added'))
                        c.description += word.value;
                    else if (word.added)
                        for (let cDiff of diffs) {
                            let cWord = cDiff[i];
                            c.description += ` ( ${cWord.value.includes(':') ? ' ' : ''}${cWord.value.replace('\n', '')}${cWord.value.includes(':') ? ' ' : ''} )${cWord.value.includes('\n') ? '\n' : ''}${cWord.value.endsWith(' ') ? ' ' : ''}`;
                        }
                            
                    else if (word.removed) {
                        if (!diff.hasOwnProperty(i+1) || !diff[i+1].added)
                            c.description += `${word.value.startsWith('\n') ? '\n' : ''}~~- ${word.value.replaceAll('\n', '')} -~~${word.value.endsWith('\n') ? '\n' : ' '}`;
                        else
                            c.description += word.value;
                    }
                }
                c.description = c.description.replaceAll('( ', '(').replaceAll(' )', ')').replaceAll('([E]', '( [E]');
            }
        }
        if (exportImages) {
            //save image
            let out = fs.createWriteStream(`${path}cards/${cardPath}.png`);
            canv.createPNGStream().pipe(out);
            out.on('finish', () => finish());
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(`${n}/${cards.length}`);
        } else finish();

        newCards.push(c);
        await finished;
    }
    data.cards = newCards;

    if (extraData.hasOwnProperty(mod)) {
        useExtraData(data, extraData[mod].post);
        for (let i of Object.keys(data).filter(n => n != 'mods'))
            for (let j of data[i])
                j.mod = mod;
    }

    if (exportImages && fs.existsSync(`${gameDataPath}relics`)) {
        console.log('\nCropping relics...');
        fs.mkdirSync(`${path}relics`);
        let relicDir = fs.readdirSync(`${gameDataPath}relics`).filter(n => n.includes('.png'));
        for (let imgPath of relicDir) {
            let canv = canvas.createCanvas(targetRelicSize, targetRelicSize);
            let ctx = canv.getContext('2d');
            let img = await canvas.loadImage(`${gameDataPath}relics/${imgPath}`);
            ctx.drawImage(img, (targetRelicSize-origRelicSize)/2, (targetRelicSize-origRelicSize)/2);
            if (imgPath.includes('-'))
                imgPath = imgPath.slice(imgPath.indexOf('-')+1);
            const out = fs.createWriteStream(`${path}relics/${imgPath}`);
            const stream = canv.createPNGStream();
            stream.pipe(out);
        }
    }
    if (exportImages) {
        console.log('Copying images...');
        for (let i of ['creatures', 'potions'])
            if (fs.existsSync(`${gameDataPath}${i}`))
                copyRecursiveSync(`${gameDataPath}${i}`, `${path}${i}`);
    }
    
    console.log('Formatting extra items...');
    if (data.hasOwnProperty('bosss'))
        for (let i in data.bosss) {
            let boss = data.bosss[i];
            boss.id = 'downfall:'+boss.name+boss.act;
            boss.name = boss.name+' '+boss.act;
            boss.description = `Act ${boss.act} Boss\n\n**${boss.buff[0]}** - ${boss.buff[1]}\n\n**Cards**: ${boss.cards.join(', ')}\n\n**Relics**: ${boss.relics.join(', ')}${boss.hasOwnProperty('customCards') ? `\n\n**Unique Cards**:\n${boss.customCards.map(c => `${c[0]} - ${c[1]}`).join('\n')}` : ''}`;
            data.bosss[i] = boss;
        }
    
    if (data.hasOwnProperty('events'))
        for (let i in data.events) {
            let event = data.events[i];
            if (!event.hasOwnProperty('id'))
                event.id = mod.toLowerCase().replaceAll(' ', '')+":"+(event.hasOwnProperty('character') ? event.character : '')+event.name;
            let desc = event.options.map(o =>`w/[${o[0]}${o[1] == null ? '' : ` n/(${o[1]})`}w/] ${o[2]}`).join('\n');
            event.description = desc.replaceAll('w/', '').replaceAll('g/', '').replaceAll('r/', '').replaceAll('n/', '').replaceAll('a/', '').replaceAll('y/', '');
            event.colouredDesc = desc.replaceAll('w/', '[2;37m').replaceAll('g/', '[2;32m').replaceAll('r/', '[2;31m').replaceAll('n/', '[0;2m').replaceAll('a/', '[2;34m').replaceAll('y/', '[2;33m');
            event.character = event.hasOwnProperty('character') ? event.character : '';
            delete event.options;
            event.campaign = event.mod == '' ? 'standard' : event.mod;
            data.events[i] = event;
        }
    
    if (exportImages) {
        console.log(`Compressing images...`);
        let imagesToCompress = gatherImages(path);
        let imageN = 0;
        for (let image of imagesToCompress) {
            await new Promise(res => execFile('node_modules/pngquant-bin/vendor/pngquant.exe', ['--quality=20-50', '--force', image, '-o', image], res));
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(`${++imageN}/${imagesToCompress.length}`);
        }
    }

    //save new data
    console.log(`\nExporting data for ${modPath}...`);
    let page = fs.readFileSync(`${gameDataPath}index.html`, 'utf-8');
    page = page.replace('style.css', '../style.css');
    let lines = page.split('\n');
    for (let i in lines) {
        let line = lines[i];
        if (lines[i].includes('Upgraded image')) {
            lines[i] = '';
        }
        if (line.startsWith('    <td><a href="card-images')) {
            lines[i] = line.replace('small-card-images', 'cards').replace('card-images', 'cards');
            lines[Number(i)+1] = '';
        } else if (line.startsWith('    <td><a href="relics/popup/')) {
            lines[i] = '    <td>'+line.slice(line.indexOf('">')+2,line.indexOf('</a>'))+'</td>'
        } else if (line.startsWith('    <td><a href="relics/popup/')) {
            lines[i] = '    <td>'+line.slice(line.indexOf('">')+2,line.indexOf('</a>'))+'</td>'
        } else if (line.startsWith('    <td><img src="relics/')) {
            let relicPath = line.slice(line.indexOf('/')+1,line.indexOf('" '))
            if (relicPath.includes('-'))
                lines[i] = '    <td><img src="relics/'+relicPath.slice(relicPath.indexOf('-')+1)+'" width="128" height="128"></td>';
        }
    }
    page = lines.join(' ').replaceAll('  ', '').replaceAll('\r', '').replaceAll('> <','><').replaceAll('>  <','><');
    fs.writeFileSync(`${path}index.html`, page);
    fs.writeFileSync(`${path}data.json`, JSON.stringify(data));
    console.log(`Done exporting ${modPath}!`);
}

function gatherImages(path) {
    let images = [];
    for (let file of fs.readdirSync(path)) {
        let filePath = `${path}/${file}`;
        if (!file.includes('.'))
            images = [...images, ...gatherImages(filePath)];
        else if (file.endsWith('.png'))
            images.push(filePath);
    }
    return images;
}

async function exportAll() {
    const isMod = n => !n.includes('.') && !['SlaytabaseModStSExporter', 'basemod', 'colors', 'extraImages'].includes(n);
    if (!process.argv.includes('--collate'))
        for (let mod of fs.readdirSync('gamedata/export').filter(isMod)) {
            await exportMod(mod);
        }
    console.log('Collating all items...');
    let fullData = {};
    let page = fs.readFileSync('gamedata/export/index.html', 'utf-8');
    for (let mod of fs.readdirSync('docs').filter(isMod)) {
        let data = JSON.parse(fs.readFileSync(`docs/${mod}/data.json`));
        for (let i in data) {
            if (Array.isArray(data[i])) {
                if (!fullData.hasOwnProperty(i)) fullData[i] = [];
                fullData[i] = [...fullData[i], ...data[i]];
            }
        }
    }
    page = page.slice(0, page.indexOf('<ul>')+4) + fs.readdirSync('docs').filter(isMod).map(mod => `<li><a href="${mod}">${mod}</a></li>`).join('') + "</ul>Note: If you're the author of any of these mods and don't want its data in the Slaytabase, contact Ocean on the slay the spire discord.<br>" + page.slice(page.indexOf('</ul>')+5);
    fs.writeFileSync('docs/data.json', JSON.stringify(fullData));
    fs.writeFileSync('docs/dataFormatted.json', JSON.stringify(fullData, null, 4));
    fs.writeFileSync('docs/index.html', page);
    console.log('Finished!');
}

exportAll();