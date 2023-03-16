import { bot, search } from './index.js';
import { User } from 'discord.js';
import { createCanvas, createImageData, loadImage } from 'canvas';
import drawText from 'node-canvas-text';
import opentype from 'opentype.js';
import { Gif } from 'make-a-gif'
import { fmFunc } from 'calculator-by-str';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { plot } from 'plot';
import '@plotex/render-image';
import fs from 'fs';
import fn from './fn.js';
import embed from './embed.js';
import cfg from './cfg.js';
import fetch from 'node-fetch';
import gm from 'gm';
import { execFile } from 'child_process';
import optipng from 'optipng-bin';

const charter = new ChartJSNodeCanvas({width: 800, height: 600, backgroundColour: 'white'});
const delSearchLimit = 25;
const font = opentype.loadSync('./memetemplates/Kreon-Regular.ttf');
const masks = {};
['a', 's', 'p'].forEach(i => masks[i] = loadImage(`./artpreview/${i}.png`));
const shadows = {};
['a', 's', 'p'].forEach(i => shadows[i] = loadImage(`./artpreview/${i}s.png`));
const cuts = {};
['a', 's', 'p'].forEach(i => cuts[i] = loadImage(`./artpreview/${i}c.png`));
const cardTypes = {
    Attack: 'a',
    Power: 'p',
    Skill: 's',
    Status: 's',
    Curse: 's'
};
const optimise = async filename => new Promise(res => execFile(optipng, ['-out', filename, filename], res));

async function meme(msg, arg, options) {
    try {
        let args = arg.split('=');
        if (args.length != options.items.length)
            return {title: `This meme requires exactly ${options.items.length} item${options.items.length == 1 ? '' : 's'}. Separate items with the "=" symbol.`};
        let items = await Promise.all(args.map(async (a, i) => {
            a = new String(a.trim());
            a.filter = arg.filter;
            if (a.startsWith('user?')) {
                let id = a.slice(5)
                let user;
                if (id == 'me')
                    user = msg.author;
                else
                    user = await bot.users.fetch(id).catch(e => {});
                if (user) {
                    user.image = await loadImage(user.avatarURL().replace('webp', 'png'));
                    return user;
                }
            } else if (a.startsWith('att?')) {
                let n = parseInt(a.slice(4));
                let attachment = msg.attachments.at(n-1);
                if (attachment == undefined)
                    return {title: 'format for attachments is att?n?name where n is the number of the attachment e.g. att?1?awsom'};
                attachment.image = await loadImage(attachment.url);
                attachment.item = {name: a.slice(6)};
                return attachment;
            }
            return options.items[i] == 1 ? a+"" : fn.find(a);
        }));
        for (let i in items) {
            if (options.items[i] == 0) {
                let item = items[i];
                if (items[i] instanceof User || items[i].hasOwnProperty('ephemeral')) continue;
                item.embed = await embed({...item.item, score: item.score, query: arg});
                if (item.embed.data.thumbnail == null)
                    return {title: `No image for ${item.item.itemType} "${item.item.name}"`};
                item.image = await loadImage(item.embed.data.thumbnail.url);
            }
        }

        if (options.hasOwnProperty('bg')) {
            let canvas = createCanvas(options.w, options.h);
            let ctx = canvas.getContext('2d');
    
            ctx.drawImage(await loadImage('./memetemplates/'+options.bg), 0, 0);
            if (options.hasOwnProperty('put'))
                for (let p of options.put)
                    ctx.drawImage(typeof p[0] == 'number' ? items[p[0]].image : await loadImage('./memetemplates/'+p[0]), p[1], p[2], p[3], p[4]);
            if (options.hasOwnProperty('texts'))
                for (let t of options.texts)
                    drawText.default(ctx, typeof items[t[0]] == 'string' ? items[t[0]] : (items[t[0]] instanceof User ? items[t[0]].username : items[t[0]].item.name.toUpperCase()), font,
                        {x: t[1], y: t[2], width: t[3], height: t[4]}, 
                        {minSize: 5, maxSize: 200, vAlign: 'center', hAlign: 'center', textFillStyle: t[5], fitMethod: 'box', drawRect: false}
                    );
            
            let buffer = canvas.toBuffer('image/png');
            let gif = new Gif(options.w, options.h, 500);
            await gif.addFrame({src: buffer});
            let render = await gif.encode();
            let filename = `export${String(Math.random()).slice(2)}.gif`;
            fs.writeFileSync(filename, render);
            return {
                title: ' ',
                image: {url: 'attachment://'+filename},
                files: [filename],
                color: typeof items[0] == 'string' || items[0] instanceof User || items[0].hasOwnProperty('ephemeral') ? null : items[0].embed.color,
            };
        } else if (options.hasOwnProperty('mkswtTemplate')) {
            
        }
    } catch(e) {
        console.error(e);
        return {title: 'failed to generate image'};
    }
}

const commands =  {
    exact: {
        'del': async msg => {
            let messages = await msg.channel.messages.fetch();
            messages = messages.filter(i => i.author.id == bot.user.id && i.reference != null);
            let i = 0;
            for (let m of messages) {
                i++;
                m = m[1];
                let found = true;
                let repliedTo = await msg.channel.messages.fetch(m.reference.messageId).catch(e => found = false);
                if (!found) continue;
                if (repliedTo.author.id == msg.author.id) {
                    await m.delete().catch(e => {});
                    await msg.delete().catch(e => {});
                    return;
                }
                if (i >= delSearchLimit) break;
            }
            return;
        },

        'spoiler': async msg => {
            let messages = await msg.channel.messages.fetch();
            messages = messages.filter(i => i.author.id == bot.user.id && i.reference != null);
            let i = 0;
            for (let m of messages) {
                i++;
                m = m[1];
                let found = true;
                let repliedTo = await msg.channel.messages.fetch(m.reference.messageId).catch(e => found = false);
                if (!found) continue;
                if (repliedTo.author.id == msg.author.id) {
                    await msg.delete().catch(e => {});
                    //spoiler hack
                    let origEmbeds = m.embeds;
                    if (origEmbeds.length > 0) {
                        await m.edit({content: `||https://bit.ly/3aSgJDF||`, embeds: [], allowedMentions: {repliedUser: false}}).catch(e => {});
                        await (new Promise(res => setTimeout(res, 1000)));
                        await m.edit({content: m.content, embeds: origEmbeds, allowedMentions: {repliedUser: false}}).catch(e => {});
                    }
                    return;
                }
                if (i >= delSearchLimit) break;
            }
            return;
        },

        'lists': async () => ({
            title: "lists",
            description: `export: ${cfg.exportURL}\nfull data: https://github.com/OceanUwU/slaytabase/blob/main/docs/data.json\nfull data (formatted): https://github.com/OceanUwU/slaytabase/blob/main/docs/dataFormatted.json\nmanually added items: https://github.com/OceanUwU/slaytabase/blob/main/extraItems.js`,
        }),
    },

    prefix: {
        help: msg => ({
            title: msg.client.user.username,
            description: `Search for an item with <item name>.
If the result isn\'t what you were looking for, you can also include the following in your search query: character, item type (e.g. card, relic, potion), type (e.g. skill, elite), or text from its description.

Anything highlighted in **bold** is a searchable keyword.

If you edit or delete your message, I will update my reply to it, according to your changes.

<item> will search through items from only vanilla Slay the Spire and one mod specific to the server (can be set by server admins with **/setservermod**).
You can replace <item> with [[item]] to search through ALL mods.
You can use **/i** to find an item with autocomplete.
You can use **/run** to run commands without anyone else seeing your result.

I'll ignore any messages which include the backtick (\`) symbol anywhere.

__Commands:__
<[item name]> displays info about an item
- search query may include the following:
- - cost=? - only returns cards with specified cost
- - type=? - specify item type
- - mod=? - specify mod name
- - r=2 - get second result
<d~[item]>, <i~[item name]>, <t~[item]> and <~[item]> are the same as the above, but the result is formatted differently
<del> deletes your last search in this channel
<spoiler> adds spoiler tags to my last reply to you in this channel
<?[search query]> shows the most likely results for a search query
- page=? - specify result page
<show10 [search query]> shows the full item details for the first 10 results for a search query
<calc [equation]> https://www.npmjs.com/package/calculator-by-str
<plot [equation] [args]> - type <plot help> for more information
<workshop?[mod]> - searches for a slay the spire mod on the steam workshop
<choose [word1 word2 word3...]> chooses one of the specified words for you at random
<rps [rock|paper|scissors]> lets you play a game of rock paper scissors with me!
<memes> help with the bot's meme generator
<artpreview [card name]> takes your first attachment and uses it as card art for a card
<c~artpreview [card name]> compares the art preview to the current card
<cut~artpreview [card name]>
<searchtext [item name]> shows the text the bot can use when searching for an item
<lists> links to lists of all items in the database
`,
            thumbnail: {url: bot.user.avatarURL()},
        }),

        '?': async (msg, arg, args) => {
            if (arg.startsWith('??')) {
                let nArg = new String('?'+arg);
                nArg.filter = arg.filter;
                let item = fn.find(nArg);
                return (await embed({...item.item, score: item.score, query: nArg}, undefined, undefined, false)).data;
            }
            let results = fn.findAll(arg);
            let page = results.page;
            let totalResults = results.total;
            results = results.slice(0, 10);

            let resultText = results.map((i, index) => `${(page*10)+index+1}: ${i.item.itemType == 'card' ? i.item.character[0].replace('The ', '').toLowerCase() : ''} ${i.item.itemType} **${i.item.name}** - ${String(Math.round((1 - i.score) * 100))}% sure`).join('\n');
            let firstEmbed = results.length > 0 ? await embed(results[0].item, msg, undefined, false) : {data: {thumbnail: null}};

            return {
                title: `Searched for "${args.filter(a => !a.includes('=')).join(' ')}"`,
                description: results.length == 0 ? 'No results.' : resultText,
                thumbnail: firstEmbed.data.thumbnail,
                footer: {text: `Page ${page+1}/${Math.ceil(totalResults/10)}`},
                color: 14598591,
            };
        },

        'show10 ': async (msg, arg, args) => {
            let results = fn.findAll(arg);
            results = results.slice(0, 10);
            let embeds = await Promise.all(results.map(async (item, index) => {
                let e = await embed({...item.item, score: item.score, query: arg}, undefined, undefined, index == 0);
                e.data.footer = {text: `${String(Math.round((1 - item.score) * 100))}% sure`};
                return e;
            }));
            return {...embeds[0].data, extra_embeds: embeds.slice(1)};
        },

        'searchtext ': async (msg, arg) => {
            let result = fn.find(arg);
            if (result.item.itemType == 'fail') return {title: "no result?"};
            return {
                title: `"${arg}" yields:`,
                description: result.item.searchText.toLowerCase(),
            };
        },

        'i~': async (msg, arg) => {
            let item = fn.find(arg);
            let itemEmbed = await embed({...item.item, score: item.score, query: arg}, undefined, undefined, false);

            return {
                title: itemEmbed.data.thumbnail == null ? `No image for ${item.item.itemType} "${item.item.name}"` : ' ',
                image: itemEmbed.data.thumbnail,
                color: itemEmbed.data.color,
            };
        },

        't~': async (msg, arg) => {
            let item = fn.find(arg);
            let itemEmbed = await embed({...item.item, score: item.score, query: arg}, undefined, undefined, false);

            return {
                title: itemEmbed.data.thumbnail == null ? `No image for ${item.item.itemType} "${item.item.name}"` : '​',
                thumbnail: itemEmbed.data.thumbnail,
                color: itemEmbed.data.color,
            };
        },

        'd~': async (msg, arg) => {
            let item = fn.find(arg);
            let itemEmbed = await embed({...item.item, score: item.score, query: arg}, undefined, undefined, false);
            switch (item.item.itemType) {
                case 'relic':
                    itemEmbed.data.description = itemEmbed.data.description.split('\n').slice(0,-1).join('\n');
                    break;
                case 'boss':
                    itemEmbed.data.description = itemEmbed.data.description.split('\n').slice(0,3).join('\n');
                    break;
                case 'event':
                    itemEmbed.data.description = `\n\n${item.item.description.replace('\n', ' ')}`;
                    break;
                default:
                    break;
            }
            return {
                ...itemEmbed.data,
                title: ' ',
                thumbnail: null,
                footer: null,
                description: `__**${itemEmbed.data.title}**__: ${itemEmbed.data.description.split('\n').slice(2).join(' ')}`,
            };
        },

        '~': async (msg, arg) => {
            let item = fn.find(arg);
            let itemEmbed = await embed({...item.item, score: item.score, query: arg}, undefined, undefined, false);
            return {
                ...itemEmbed.data,
                footer: null,
                description: null,
            };
        },

        'choose ': async (msg, arg, args) => {
            if (args.length > 0)
                return {
                    title: `I choose "${args[Math.floor(Math.random() * args.length)]}"`,
                };
        },

        'c~artpreview ': async (msg, arg) => {
            try {
                let args = arg.split('=');
                let att = 0;
                if (args.length > 1)
                    att = parseInt(args[1])-1;
                let art = msg.attachments.at(att);
                if (art == undefined) return {title: 'you need to attach an image to preview!'};
                args[0] = new String(args[0]);
                args[0].filter = arg.filter;
                let item = fn.find(args[0]);
                if (!item.item.hasOwnProperty('itemType') || !['card', 'relic'].includes(item.item.itemType))
                    return {title: `that item couldn\'t be previewed. found ${item.item.itemType} "${item.item.name}"`};
                let itemEmbed = await embed({...item.item, score: item.score, query: args[0]});

                switch (item.item.itemType) {
                    case 'card':
                        let artcanvas = createCanvas(500,380);
                        let artctx = artcanvas.getContext('2d');
                        artctx.drawImage(await loadImage(art.url), 0, 0, 500, 380);
                        artctx.globalAlpha = 0.25;
                        artctx.drawImage(await shadows[cardTypes[item.item.type]], 0, 0);
                        artctx.globalAlpha = 1;
                        artctx.globalCompositeOperation = 'destination-out';
                        artctx.drawImage(await masks[cardTypes[item.item.type]], 0, 0);
        
                        let canvas = createCanvas(1356,874);
                        let ctx = canvas.getContext('2d');
                        ctx.drawImage(await loadImage(itemEmbed.data.thumbnail.url), 0, 0, 678, 874, 0, 0, 678, 874);
                        ctx.drawImage(artcanvas, 89, 123);
                        ctx.drawImage(await loadImage(itemEmbed.data.thumbnail.url), 678, 0);
            
                        let filename = `${(item.item.id.includes(':') ? item.item.id.slice(item.item.id.indexOf(':')+1) : item.item.id).replaceAll(' ', '-')}_preview-${String(Math.random()).slice(10)}.png`;
                        fs.writeFileSync(filename, canvas.toBuffer());
        
        
                        let cutcanvas = createCanvas(500,380);
                        let cutctx = cutcanvas.getContext('2d');
                        cutctx.drawImage(await loadImage(art.url), 0, 0, 500, 380);
                        cutctx.globalCompositeOperation = 'destination-out';
                        cutctx.drawImage(await cuts[cardTypes[item.item.type]], 0, 0);
                        let filename2 = filename.replace('_preview-', '_p-');
                        fs.writeFileSync(filename2, cutcanvas.toBuffer());
                        await optimise(filename2);
        
                        let smallcanvas = createCanvas(250,190);
                        let smallctx = smallcanvas.getContext('2d');
                        smallctx.drawImage(cutcanvas, 0, 0, 250, 190);
                        let filename3 = filename2.replace('_p-', '-');
                        fs.writeFileSync(filename3, smallcanvas.toBuffer());
                        await optimise(filename3);
        
                        return {
                            title: item.item.name,
                            description: '250x190 →',
                            image: {url: 'attachment://'+filename},
                            thumbnail: {url: 'attachment://'+filename3},
                            footer: {iconURL: 'attachment://'+filename2, text: '← 500x380'},
                            files: [filename, filename2, filename3],
                            color: itemEmbed.data.color,
                        };


                    case 'relic':
                        let rFilename = `${(item.item.id.includes(':') ? item.item.id.slice(item.item.id.indexOf(':')+1) : item.item.id).replaceAll(' ', '-')}_preview-${String(Math.random()).slice(10)}.png`;
                        let rFilename2 = rFilename.replace('_preview-', '_outline-');
                        let rFilename3 = rFilename.replace('_preview-', '-');
                        let relicanvas = createCanvas(256, 256);
                        let relictx = relicanvas.getContext('2d');
                        relictx.drawImage(await loadImage(art.url), 0, 0, 256, 256);
                        let relicImageData = relictx.getImageData(0, 0, 256, 256)
                        for (let i = 0; i < relicImageData.data.length; i += 4) {
                          relicImageData.data[i] = 255;
                          relicImageData.data[i+1] = 255;
                          relicImageData.data[i+2] = 255;
                        }
                        let outlinecanvas = createCanvas(256, 256);
                        let outlinectx = outlinecanvas.getContext('2d');
                        outlinectx.putImageData(relicImageData,0,0);
                        await new Promise(res => gm(outlinecanvas.toBuffer())
                            .edge(4, 4)
                            .write(rFilename2, err => {
                                if (err) throw err;
                                res();
                            }));
                        outlinectx.clearRect(0,0,256,256);
                        outlinectx.drawImage(await loadImage(rFilename2),0,0);
                        let outlineImageData = outlinectx.getImageData(0, 0, 256, 256);
                        let outlineImageDataBlack = createImageData(256,256);
                        for (let i = 0; i < outlineImageData.data.length; i += 4) {
                            outlineImageData.data[i] = 255;
                            outlineImageData.data[i+1] = 255;
                            outlineImageData.data[i+2] = 255;
                            outlineImageData.data[i+3] = 255-outlineImageData.data[i+3];
                            outlineImageDataBlack.data[i] = 0;
                            outlineImageDataBlack.data[i+1] = 0;
                            outlineImageDataBlack.data[i+2] = 0;
                            outlineImageDataBlack.data[i+3] = outlineImageData.data[i+3];
                        }
                        outlinectx.clearRect(0,0,256,256);
                        outlinectx.putImageData(outlineImageData,0,0);
                        fs.writeFileSync(rFilename2, outlinecanvas.toBuffer());
                        outlinectx.putImageData(outlineImageDataBlack,0,0);
                        let compareCanvas = createCanvas(300,150);
                        let compareCtx = compareCanvas.getContext('2d');
                        compareCtx.globalAlpha = 0.11;
                        compareCtx.drawImage(outlinecanvas, -53, -53);
                        compareCtx.globalAlpha = 1;
                        compareCtx.drawImage(relicanvas, -53, -53);
                        compareCtx.drawImage(await loadImage(itemEmbed.data.thumbnail.url), 150, 0);
                        fs.writeFileSync(rFilename, compareCanvas.toBuffer());
                        fs.writeFileSync(rFilename3, relicanvas.toBuffer());
                        await new Promise(res => gm(rFilename2).resize(128,128).write(rFilename2, res));
                        await new Promise(res => gm(rFilename3).resize(128,128).write(rFilename3, res));
                        await optimise(rFilename2);
                        await optimise(rFilename3);
                        return {
                            title: item.item.name,
                            description: '128x128 →',
                            image: {url: 'attachment://'+rFilename},
                            thumbnail: {url: 'attachment://'+rFilename3},
                            footer: {iconURL: 'attachment://'+rFilename2, text: '← outline'},
                            files: [rFilename, rFilename2, rFilename3],
                            color: itemEmbed.data.color,
                        };
                }
            } catch(e) {
                console.error(e);
                return {title: 'failed to generate image'};
            }
        },

        'artpreview ': async (msg, arg) => {
            try {
                let preview = await commands.prefix['c~artpreview '](msg, arg);
                let img = await loadImage(preview.files[0]);
                let canvas = createCanvas(img.width/2,img.height);
                let ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                fs.writeFileSync(preview.files[0], canvas.toBuffer());
                return preview;
            } catch(e) {
                console.error(e);
                return {title: 'failed to generate image'};
            }
        },

        'cut~artpreview ': async (msg, arg) => {
            try {
                let preview = await commands.prefix['c~artpreview '](msg, arg);
                delete preview.image;
                fs.unlinkSync(preview.files[0]);
                preview.files = preview.files.slice(1);
                return preview;
            } catch(e) {
                console.error(e);
                return {title: 'failed to generate image'};
            }
        },

        'rps': async (msg, arg, __, oa) => {
            //so you decided to dig deeper and find out why everyone except a certain few always loses...
            //well, you found us. i guess it's time to let you in on the secret.
            //to win or draw, copy the zero width space from inbetween these brackets --> (​) and include it anywhere in your call to this command
            //DON'T TELL ANYONE THIS, this remains between you and me and anyone else who's looked at this code 
            let rps = ['rock', 'paper', 'scissors']
            let n = 0;
            for (let i of ['r', 'p', 's']) {
                if (arg.startsWith(i)) {
                    if (oa.includes('​')) {
                        let win = Math.random() > 0.5;
                        return {title: `i choose ${rps[(n+(win?2:0))%3]} - ${win ? 'you win...' : 'it\'s a draw.'}`};
                    } else
                        return {title: `i choose ${rps[(n+1)%3]} - i win!`};
                }
                n++;
            }
            return {title: 'choose "rock", "paper", or "scissors"'};
        },

        memes: () => ({
            title: 'Meme generator',
            description: `Some memes take more than one item, separate items with the "=" symbol.
The bot can also take users as arguments, to grab their profile pictures, with <meme user?[userId]> for example: <user?${bot.user.id} my beloved>
You can also use just "user?me" to specify yourself.
            
__List of memes:__
<megamind no [item]>
<megamind textno [text]>
<friendship ended [bad item]=[good item]=[friender]>
<coolerdaniel [daniel]=[coolerdaniel]>
<19 dollar [fortnite card]>
<distracted [gf]=[distraction]=[bf]>
<[item] my beloved>
<why cant i hold all these [item]=[holder]>
<[item] speech bubble>
<the floor here is made out of [item]>
<the text here is made out of [text]>
<sb [item]=[text in speech bubble]>
<sb [item1]=[text1]=[item2]=[text2]>
<[item] from slay the spire>
`,
            thumbnail: {url: 'https://media.discordapp.net/attachments/802410376498249820/1002367368623825027/unknown.png?width=566&height=566'},
        }),

        'megamind no ': async (msg, arg) => await meme(msg, arg, {
            w: 640,
            h: 640,
            bg: 'mm.jpg',
            items: [0],
            put: [[0, 182, 39, 354, 96]]
        }),

        'megamind textno ': async (msg, _, __, oa) => await meme(msg, oa, {
            w: 640,
            h: 640,
            bg: 'mm.jpg',
            items: [1],
            texts: [[0, 182, 39, 354, 96, 'white']]
        }),

        'friendship ended ': async (msg, arg) => await meme(msg, arg, {
            w: 600,
            h: 450,
            bg: 'fse.png',
            items: [0, 0, 0],
            put: [
                [1, 113, 66, 111, 107],
                [2, 380, 103, 98, 127],
                [0, 0, 247, 143, 200],
                [0, 422, 271, 176, 177],
                ['fsecross1.png', 4, 260, 135, 184],
                ['fsecross2.png', 431, 283, 155, 149]
            ],
            texts: [
                [0, 402, 0, 170, 64, 'red'],
                [1, 235, 123, 98, 49, 'green'],
            ]
        }),

        'coolerdaniel ': async (msg, arg) => await meme(msg, arg, {
            w: 1452,
            h: 816,
            bg: 'daniel.png',
            items: [0, 0],
            put: [
                [0, 229, 84, 381, 458],
                [1, 794, 110, 341, 414],
            ]
        }),

        '19 dollar ': async (msg, arg) => await meme(msg, arg, {
            w: 779,
            h: 751,
            bg: '19dollar.png',
            items: [0],
            put: [[0, 60, 404, 157, 229]],
            texts: [[0, 82, 653, 622, 98, 'white']]
        }),

        'distracted ': async (msg, arg) => await meme(msg, arg, {
            w: 800,
            h: 533,
            bg: 'distracted.png',
            items: [0, 0, 0],
            put: [
                [0, 598, 145, 110, 108],
                [1, 152, 120, 158, 160],
                [2, 397, 88, 89, 106]
            ],
        }),

        'why cant i hold all these ': async (msg, arg) => await meme(msg, arg, {
            w: 450,
            h: 600,
            bg: 'hold.png',
            items: [0, 0],
            put: [
                [0, 116, 439, 38, 38],
                [0, 225, 374, 44, 40],
                [0, 187, 370, 38, 38],
                [0, 207, 390, 37, 37],
                [0, 148, 349, 44, 43],
                [0, 105, 367, 45, 43],
                ['holdhand.png', 87, 351, 253, 131],
                [0, 221, 398, 48, 45],
                [1, 139, 100, 124, 160],
            ],
            texts: [[0, 276, 518, 86, 48, 'white']]
        }),

        'the floor here is made out of ': async (msg, arg) => await meme(msg, arg, {
            w: 554,
            h: 394,
            bg: 'floor.png',
            items: [0],
            put: [
                [0, 278, 208, 47, 50],
                [0, 496, 208, 47, 50],
            ],
        }),
        
        'the text here is made out of ': async (msg, arg) => await meme(msg, arg, {
            w: 554,
            h: 394,
            bg: 'floor.png',
            items: [1],
            texts: [
                [0, 278, 208, 47, 50, 'black'],
                [0, 496, 208, 47, 50, 'black'],
            ],
        }),
        
        'randomitem': async (msg, arg) => {
            let items = search._docs.map(i => ({item: i}));
            if (arg.filter) items = items.filter(arg.filter);
            let itemNum = Math.floor(Math.random() * items.length);
            let item = items[itemNum].item;
            return {...(await embed({...item, score: 0, query: fn.unPunctuate(item.name)}, undefined, undefined, false)).data, footer: {text: `Item ${itemNum+1}/${items.length}`}};
        },

        'sb ': async (msg, _, __, oa) => {
            let numArgs = oa.split('=').length;
            if (numArgs % 2 != 0) return {title: "The number of arguments for this must be a multiple of 2."};

            let options = {
                w: 100*numArgs,
                h: 200,
                bg: 'empty.png',
                items: [],
                put: [],
                texts: [],
            };
            for (let i = 0; i < numArgs / 2; i++) {
                let xOffset = 200*i;
                options.items.push(0);
                options.items.push(1);
                options.put.push([2*i, 25+xOffset, 50, 150, 150]);
                options.put.push(['speechbubble2.png', 0+xOffset, 0, 200, 200]);
                options.texts.push([2*i+1, 17+xOffset, 13, 164, 31, 'black']);
            }
            return await meme(msg, oa, options);
        },

        'calc ': async (msg, _, __, oa) => {
            return {
                title: ' ',
                description: oa.split(',').map(eq => `${eq.replaceAll('\\*', '*').replaceAll('*', '\\*')} = ${fmFunc(eq)}`).join('\n'),
            }
        },

        'plot ': async (msg, arg, _, oa) => {
            if (arg == 'help') {
                return {
                    title: 'plot help',
                    description: 'example: <plot y=x*(x+7)/2+12 minx=0 maxx=20 interval=1> would output the following:',
                    image: {url: 'https://media.discordapp.net/attachments/959928848076660756/1065417596507275264/graph8854503956392445.png?width=720&height=540'}
                }
            }
            let attrs = {};
            let args = oa.toLowerCase().split(' ');
            for (let i of args.slice(1)) {
                if (!i.includes('=')) return {title: 'invalid arguments'};
                let parts = i.split('=');
                attrs[parts[0]] = Number(parts[1]);
                if (Number.isNaN(attrs[parts[1]])) return {title: 'invalid number'};
            }
            for (let i of ['minx', 'maxx', 'interval']) if (!attrs.hasOwnProperty(i)) return {title: `missing "${i}" argument`};
            let numPoints = (attrs.maxx-attrs.minx)/attrs.interval;
            if (numPoints < 1 || numPoints > 1000) return {title: 'must graph at least 1 point and at most 1001 points'};
            let equation = args[0];
            if (equation.includes('=')) equation = equation.slice(equation.indexOf('=')+1);
            let points = [];
            for (let x = attrs.minx; x <= attrs.maxx; x+=attrs.interval)
                points.push({x: x, y: fmFunc(equation.replaceAll('x', x))});
            let filename = `graph${String(Math.random()).slice(2)}.png`;
            let precision = Math.ceil(attrs.interval);
            fs.writeFileSync(filename, await charter.renderToBuffer({
                type: 'line',
                data: {
                    labels: points.map(p => Number(p.x.toPrecision(5))),
                    datasets: [{
                        label: "y = "+equation,
                        data: points.map(p => p.y),
                    }]
                },
                options: {}
            }));
            return {
                title: ' ',
                image: {url: 'attachment://'+filename},
                files: [filename]
            };
        },

        'workshop?': async (msg, arg) => {
            let response = await fetch(`https://steamcommunity.com/workshop/browse/?appid=646570&searchtext=${arg.replaceAll(' ', '+')}`);
            let body = await response.text();
            if (body.includes('class="ugc"')) {
                body = body.split('\n');
                let linkIndex = body.findIndex(e => e.includes('class="ugc"'));
                let link = body[linkIndex];
                let img = body[linkIndex+2];
                let title = body[linkIndex+10];
                let url = link.slice(link.indexOf('"')+1,link.indexOf('" '));
                let imgUrl = img.slice(img.indexOf('src="')+5,img.indexOf('">'));
                let name = title.slice(title.indexOf('s">')+3,title.indexOf('</div>'));
                return {
                    title: name,
                    url,
                    image: {url: imgUrl},
                };
            } else return {title: `no mod found under ${arg}`};
        },

        'forcestop': async (msg, arg) => {
            if (cfg.overriders.includes(msg.author.id)) {
                setTimeout(process.exit, 1000);
                return {title: "stopped."};
            } else return {title: ":/"};
        },
    },

    suffix: {
        ' my beloved': async (msg, arg) => await meme(msg, arg, {
            w: 640,
            h: 480,
            bg: 'beloved.png',
            items: [0],
            put: [[0, 103, 200, 164, 139]],
            texts: [[0, 373, 130, 202, 71, 'black']]
        }),

        ' from slay the spire': async (msg, arg) => await meme(msg, arg, {
            w: 680,
            h: 538,
            bg: 'fromsts.png',
            items: [0],
            put: [[0, 234, 75, 137, 126]],
            texts: [[0, 235, 352, 243, 47, 'black']]
        }),

        ' speech bubble': async (msg, arg) => await meme(msg, arg, {
            w: 200,
            h: 200,
            bg: 'empty.png',
            items: [0],
            put: [
                [0, 25, 50, 150, 150],
                ['speechbubble.png', 0, 0, 200, 200]
            ],
        }),
    }
};

export default commands;