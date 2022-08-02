import { MessageEmbed } from 'discord.js';
import wikiItems from './wikiItems.js';
import cfg from './cfg.js';

const mods = {
    'slay-the-spire': ['Slay the Spire', 'slay-the-spire', 'Standard', 4608066],
    'downfall': ['Downfall', 'sts-downfall', 'Downfall', 5177858],
};
const searchize = item => {
    if (!item.hasOwnProperty('name'))
        return '';
    let name = item.name;
    if (item.hasOwnProperty('character') && wikiItems[item.character[0]].hasOwnProperty(item.name))
        name = wikiItems[item.character[0]][item.name]
    return name.replaceAll(' ', '_').replaceAll('+', '').replaceAll('???', 'Unidentified');
};

async function embed(item, msg, embeds=[]) {
    let e = new MessageEmbed();
    e.title = `${item.name}`;
    if (!mods.hasOwnProperty(item.mod))
        item.mod = 'downfall';
    if (item.hasOwnProperty('mod'))
        e.url = `https://${mods[item.mod.toLowerCase()][1]}.fandom.com/wiki/${searchize(item)}`;
    e.footer = {
        //iconURL: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.webp?size=32`,
        text: `<${item.query}> = ${item.name == 'No results' ? '?' : item.searchName}${item.score != undefined ? ', '+String(Math.round((1 - item.score) * 100))+'% sure' : ''}`, //text: `${msg.author.username}: <${item.query}>`,
    };
    switch (item.itemType) {
        case 'card':
            e.thumbnail = {url: `${cfg.exportURL}/altered/img/cards/${item.color.slice(0,10)}-${item.name.replace('+', '').replaceAll(' ', '').replaceAll(':', '-').replaceAll('\'', '').replaceAll('?', '')}.png`};
            e.color = item.character[1];
            e.description = `${item.type != 'Curse' ? `${item.rarity} ${item.type} / ` : ''}${item.description.includes('Unplayable') ? '' : `${item.cost} ${item.character[2]} / `}${item.character[0]}\n\n${item.description}`;
            break;

        case 'relic':
            if (item.mod == 'slay-the-spire')
                e.thumbnail = {url: `${cfg.exportURL}/altered/img/relics/${item.mod}/${item.character[3]}${item.name.replaceAll(' ', '').replaceAll('\'', '')}.png`};
            else
                e.thumbnail = {url: `https://${mods[item.mod.toLowerCase()][1]}.fandom.com/wiki/Special:Filepath/${searchize(item)}.png`};
            e.color = item.character[1];
            e.description = ` ${item.tier} Relic / ${item.character[0]}\n\n${item.description}\n*${item.flavorText}*`;
            break;
            
        case 'potion':
            e.url = `https://${mods[item.mod.toLowerCase()][1]}.fandom.com/wiki/Potions`;
            e.thumbnail = {url: `${cfg.exportURL}/export/${item.mod}/potions/${item.name.replaceAll(' ', '')}.png`};
            if (item.character[0] != 'All')
                e.color = item.character[1];
            e.description = `${item.rarity} Potion / ${item.character[0]}\n\n${item.description}`;
            break;
        
        case 'event':
            e.color = mods[item.mod.toLowerCase()][3];
            e.thumbnail = {url: `${cfg.exportURL}/altered/img/events/${item.name.toLowerCase().replaceAll(' ', '').replaceAll('?', '').replaceAll('!', '')}.jpg`};
            e.description = `${mods[item.mod.toLowerCase()][2]} event / Act${item.acts.length > 1 ? 's' : ''} ${item.acts.join(', ')} / ${item.character[0]}${item.character == 'All' ? ' characters' : ''}\n\`\`\`ansi\n${item.colouredDesc.replaceAll('\n', '\n``````ansi\n')}\n\`\`\``;
            break;
            
        case 'creature':
            e.thumbnail = {url: `${cfg.exportURL}/export/${item.mod}/creatures/${item.name.replaceAll(' ', '')}.png`};
            e.description = `${item.type} / ${item.minHP}-${item.maxHP} HP`;
            break;
        
        case 'boss':
            e.thumbnail = {url: `${cfg.exportURL}/altered/img/bosses/${item.name.replaceAll(' ', '').toLowerCase()}.png`};
            e.color = item.character[1];
            e.description = item.description;
            e.url = e.url.replace('_', '_(Act_')+'_Boss)';
            break;
        
        case 'keyword':
            e.description = `Keyword\n\n${item.description}`;
            break;
        
        case 'command':
            e.color = 16777215;
            e.title = '';
            delete e.url;
            delete e.footer;
            let args;
            if (item.type == 'prefix')
                args = item.query.slice(item.name.length);
            else if (item.type == 'suffix')
                args = item.query.slice(0, item.query.length-item.name.length);
            args = args.trim().split(' ');
            let result = await item.do(msg, args.join(' '), args, item.originalQuery);
            for (let i in result)
                e[i] = result[i];
            break;
        
        case 'fail':
            delete e.url;
            e.description = `If you think this is a mistake, contact <@106068236000329728>\n\n${Object.values(mods).map(mod => `[Search for "${item.query.replaceAll('+', '')}" on the ${mod[0]} wiki](https://${mod[1]}.fandom.com/wiki/Special:Search?query=${item.query.replaceAll('+', '').replaceAll(' ', '+')})?`).join('\n')}`;
            e.color = 0;
            break;
    }

    if (e.hasOwnProperty('url'))
        e.url += `?embnum=${embeds.length}`;
    if (item.hasOwnProperty('img'))
        e.thumbnail = {url: cfg.exportURL+item.img};

    return e.title == '' ? null : e;
}

export default embed;