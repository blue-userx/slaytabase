const keywords = [
    ['[R]', '<:e_red:961808772177731624>'],
    ['[G]', '<:e_green:961808772114833428>'],
    ['[B]', '<:e_blue:961808772244832278>'],
    ['[W]', '<:e_purple:961808772127399967>'],
    ['[fist_icon]', '<:finisher:961810374120849418>'],
    ['champ:Combo:', 'Combo:'],
];

const directKeywords = [
    'Exhaust',
    'Ethereal',
    'Echo',
    'Retain',
    'Innate',
    'Unplayable',
    'Fleeting',

    'Weak',
    'Frail',
    'Vulnerable',
    'Strength',
    'Dexterity',
    'Focus',
    'Vigor',
    'Artifact',
    'Intangible',
    'Confused',

    'Stance',
    'Scry',
    'Fetch',
    'Block',
    'Temporary HP',
    'Upgrade',
    'Fatal',
    'Transform',
    'Status',
    'Curse',
];

export default function keywordify(text, character) {
    text = text.replaceAll('[E]', `**${character[2]}**`);
    for (let i of keywords)
        text = text.replaceAll(i[0], `**${i[1]}**`);
    for (let i of directKeywords)
        text = text.replaceAll(i, `**${i}**`);
    let lines = text.split('\n');
    for (let i in lines) {
        let words = lines[i].split(' ');
        for (let j in words) {
            let word = words[j];
            if (word.includes(':') && word.indexOf(':') != word.length-1 && !word.startsWith('**')) //if is modded keyword
                words[j] = `**${word.slice(word.indexOf(':')+1)}**`;
        }
        lines[i] = words.join(' ');
    }
    text = lines.join('\n');
    return text;
}