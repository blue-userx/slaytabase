
import { search } from './index.js';


const unPunctuate = str => str.replaceAll('\n', ' ').replace(/[^\w\s?=]|_/g, "").replace(/\s+/g, " ").trim().toLowerCase();

function find(query) {
    let results = search.search(unPunctuate(query));
    let item = results.length > 0 ? results[0] : undefined; //(query.includes('+') ? results.find(e => e.name.includes('+')) : results[0])
    let cmdName = query.split(' ')[0];
    if (item == undefined)
        item = {item: {
            itemType: 'fail',
            name: 'No results',
        }};
    else if (item.item.searchName != query) {
        let exactMatch = search._docs.find(e => e.searchName == query);
        if (exactMatch != undefined)
            item = {item: exactMatch, score: 0};
    }
    return item;
}

export default {
    unPunctuate,
    find,
};