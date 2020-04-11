const cloudscraper = require('cloudscraper');

cloudscraper.get('https://www.curseforge.com/minecraft/mc-mods/esther').then(res => {
    console.log(res);
});