import { search } from './index.js';

const unPunctuate = str => str.replaceAll('\n', ' ').replace(/[^\w\s?~=:]|_/g, "").replace(/\s+/g, " ").trim().toLowerCase();

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  

function findAll(query) {
    let args = query.split(' ');
    let results;
    if (args[0] == "randomitem")
        results = shuffle(search._docs.map((r, i) => ({item: r, score: 0, refIndex: i})));
    else
        results = search.search(args.filter(a => !a.includes('=')).join(' '));
    console.log(results[0]);
    console.log(search._docs[1]);
    if (query.filter) results = results.filter(query.filter);
    let page = 0;
    for (let i of args) {
        if (i.includes("=")) {
            let prop = i.slice(0, i.indexOf("="));
            let val = i.slice(i.indexOf("=")+1);
            switch (prop) {
                case "cost":
                    results = results.filter(r => r.item.hasOwnProperty('cost') && r.item.cost.toLowerCase().includes(val));
                    break;

                case "type":
                    results = results.filter(r => r.item.hasOwnProperty('itemType') && r.item.itemType.toLowerCase().includes(val));
                    break;

                case "mod":
                    results = results.filter(r => r.item.hasOwnProperty('mod') && (r.item.mod.toLowerCase().includes(val) || val.includes(r.item.mod.toLowerCase())));
                    break;
                
                case "r":
                    let resultNum = Math.max(1, Math.min(parseInt(val), results.length)) - 1;
                    if (Number.isNaN(resultNum)) resultNum = 0;
                    results = results.slice(resultNum);
                    break;
                
                case "page":
                    page = Math.max(0, parseInt(val)-1);
                    if (Number.isNaN(page)) page = 0;
                    break;
            }
        }
    }
    let total = results.length;
    results = results.slice(10*page);
    results.total = total;
    results.page = page;
    return results;
}

function find(query) {
    let results = findAll(query);
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
    findAll,
    find,
};