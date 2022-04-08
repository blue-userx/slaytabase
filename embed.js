import { MessageEmbed } from 'discord.js';
import characters from './characters.js';
const exportURL = 'https://darkvexon.github.io/export';

function embed(item) {
    let e = new MessageEmbed();
    e.title = item.name;
    switch (item.itemType) {
        case 'card':
            let character = characters[item.color];
            e.thumbnail = {url: `${exportURL}/${item.mod}/card-images/${item.color.slice(0,10)}-${item.name.replaceAll(' ', '').replace('+', 'Plus')}.png`};
            e.color = character[1];
            e.description = `${item.type != 'Curse' ? `${item.rarity} ${item.type} / ` : ''}${item.description.includes('Unplayable') ? '' : `${item.cost} ${character[2]} / `}${character[0]}\n\n${item.description}`;
            break;

        case 'relic':
            let pool = characters[item.pool];
            e.thumbnail = {url: `${exportURL}/${item.mod}/relics/${pool[3]}${item.name.replaceAll(' ', '')}.png`};
            e.color = pool[1];
            e.description = ` ${item.tier} Relic / ${pool[0]}\n\n${item.description}\n*${item.flavorText}*`;
            break;
            
        case 'potion':
            e.thumbnail = {url: `${exportURL}/${item.mod}/potions/${item.name.replaceAll(' ', '')}.png`};
            e.description = `${item.rarity}\n\n${item.description}`;
            break;
            
        case 'creature':
            e.description = `${item.type} / ${item.minHP}-${item.maxHP} HP`;
            break;
        
        case 'keyword':
            e.description = `Keyword\n\n${item.description}`;
            break;
        
        case 'help':
            e.title = 'DownfallBot';
            e.color = 16777215;
            e.description = 'Search for an item with <item name>.\nTo view a card\'s upgrade, use <item name+>.\nIf the result is of the wrong type (e.g. you are looking for <agony> and get "Endless Agony") you can search the item type, with <agony keyword> or <agony k>.\nTo search for a result with a title EXACTLY matching "item name", use <=item name>.\n\nAnything highlighted in **bold** is a searchable keyword.';
            break;
        
        case 'fail':
            e.color = 0;
            e.description = `Sorry, couldn\'t find anything matching "${item.query}".`;
            break;
    }
    return e;
}

export default embed;