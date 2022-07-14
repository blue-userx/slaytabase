const emojis = [
    ['finisheremoji', 'finisher:961810374120849418'],
    ['Artifact', 'p_artifact:997273885995188335'],
    ['Block', 'p_block:997281211305181314'],
    ['Blur', 'p_blur:997273889950416908'],
    ['Counter', 'p_counter:997275619337453690'],
    ['Dexterity', 'p_dexterity:997273884330037260'],
    ['Focus', 'p_focus:997273883122089994'],
    ['Frail', 'p_frail:997273897697288202'],
    ['Goop', 'p_goop:997275103463219280'],
    ['gold', 'p_gold:997287497883193344'],
    ['Gold', 'p_gold:997287497883193344'],
    ['souls', 'p_gold:997287497883193344'],
    ['Souls', 'p_gold:997287497883193344'],
    ['Intangible', 'p_intangible:997281585177055262'],
    ['Intensity', 'p_intensity:997274751028437022'],
    ['Mantra', 'p_mantra:997273892051750963'],
    ['Poison', 'p_poison:997273896237666385'],
    ['Potency', 'p_potency:997276392007925852'],
    ['Soulburn', 'p_soulburn:997276073010147328'],
    ['Strength', 'p_strength:997273888897642696'],
    ['temporary', 'p_temp:997273899039473724'],
    ['Temporary', 'p_temp:997273899039473724'],
    ['Thorns', 'p_thorns:997273887358337206'],
    ['Vigor', 'p_vigor:997275506749743126'],
    ['Vulnerable', 'p_vulnerable:997273894861934602'],
    ['Weak', 'p_weak:997273893402325102'],
    ['Wiz', 'p_wiz:997275808316010607'],
];

export default function emojify(text, character) {
    text = text.replaceAll('Energy', `${character[2]}`);
    for (let i of emojis)
        text = text.replaceAll(i[0], `${i[0]}<:${i[1]}>`);
    return text;
}