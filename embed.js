import { MessageEmbed } from 'discord.js';
import cfg from './cfg.js';

function embed(item) {
    let e = new MessageEmbed();
    e.title = `__${item.name}__`;
    e.footer = {text: `<${item.query}>`};
    switch (item.itemType) {
        case 'card':
            e.thumbnail = {url: `${cfg.exportURL}/${item.mod}/card-images/${item.color.slice(0,10)}-${item.name.replaceAll(' ', '').replace('+', 'Plus')}.png`};
            e.color = item.character[1];
            e.description = `${item.type != 'Curse' ? `${item.rarity} ${item.type} / ` : ''}${item.description.includes('Unplayable') ? '' : `${item.cost} ${item.character[2]} / `}${item.character[0]}\n\n${item.description}`;
            break;

        case 'relic':
            e.thumbnail = {url: `${cfg.exportURL}/${item.mod}/relics/${item.character[3]}${item.name.replaceAll(' ', '')}.png`};
            e.color = item.character[1];
            e.description = ` ${item.tier} Relic / ${item.character[0]}\n\n${item.description}\n*${item.flavorText}*`;
            break;
            
        case 'potion':
            e.thumbnail = {url: `${cfg.exportURL}/${item.mod}/potions/${item.name.replaceAll(' ', '')}.png`};
            e.description = `${item.rarity}\n\n${item.description}`;
            break;
            
        case 'creature':
            e.thumbnail = {url: `${cfg.exportURL}/${item.mod}/creatures/${item.name.replaceAll(' ', '')}.png`};
            e.description = `${item.type} / ${item.minHP}-${item.maxHP} HP`;
            break;
        
        case 'keyword':
            e.description = `Keyword\n\n${item.description}`;
            break;
        
        case 'help':
            e.title = 'DownfallBot';
            e.color = 16777215;
            e.description = 'Search for an item with <item name>.\nTo view a card\'s upgrade, use <item name+>.\nIf the result is of the wrong type (e.g. you are looking for <agony> and get "Endless Agony") you can search the item type, with <agony keyword> or <agony k>.\n\nAnything highlighted in **bold** is a searchable keyword.';
            break;
        
        case 'fail':
            e.color = 0;
            break;
    }
    return e;
}

export default embed;