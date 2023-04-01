import wordsArray from "words-array";

//adapted from https://www.npmjs.com/package/canvas-multiline-text
export default (ctx, text, opts) => {
	let words = wordsArray(text);
	let lines = [];

    let carryOn = false;
    do {
        carryOn = false;
        for (let fontSize = opts.minFontSize; fontSize <= opts.maxFontSize; fontSize++) {
            ctx.font = ' ' + fontSize + 'px Kreon';
            let y = opts.rect.y + fontSize;
            lines = [];
            let line = '';
    
            let textWidth;
            for (let word of words) {
                let linePlus = line + word + ' ';
                textWidth = ctx.measureText(linePlus).width;
                if (textWidth > opts.rect.width) {
                    lines.push({text: line, y: y});
                    line = word + ' ';
                    y += fontSize * opts.lineHeight;
                } else {
                    line = linePlus;
                }
            }
    
            lines.push({ text: line, y: y});
    
            let max = opts.rect.y + opts.rect.height - fontSize*0.34;
            if (y > max || words.length == 1 && textWidth > opts.rect.width + 3) {
                if (fontSize <= opts.minFontSize) break;
                if (y - max > 3 || textWidth - opts.rect.width > 3) {
                    opts.maxFontSize = fontSize-1;
                    carryOn = true;
                }
                break;
            }
        }
    } while (carryOn)

    ctx.textAlign = 'center';
    let centerX = opts.rect.x + opts.rect.width / 2;
    if (lines.length > 1)
        for (let line of lines)
            ctx.fillText(line.text.trim(), centerX, line.y);
    else {
        ctx.textBaseline = 'middle';
        ctx.fillText(lines[0].text.trim(), centerX, opts.rect.y + opts.rect.height / 2);
    }
};