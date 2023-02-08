
import { search } from './index.js';


const unPunctuate = str => str.replaceAll('\n', ' ').replace(/[^\w\s?~=:]|_/g, "").replace(/\s+/g, " ").trim().toLowerCase();

function find(query) {
    let results = search.search(query);
    if (query.filter) results = results.filter(query.filter);
    let item = results.length > 0 ? results[0] : undefined; //(query.includes('+') ? results.find(e => e.name.includes('+')) : results[0])
    if (item == undefined)
        item = {item: {
            itemType: 'fail',
            name: 'No results',
        }};
    else if (item.item.searchName != query) {
        let exactMatch = results.find(e => e.item.searchName == query || e.item.searchId == query);
        if (exactMatch != undefined)
            item = exactMatch;
    }
    return item;
}

export default {
    unPunctuate,
    find,
};