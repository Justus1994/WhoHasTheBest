const Discord = require("discord.js");
const ApiSwgohHelp = require('api-swgoh-help');
const Fuse = require('fuse-js-latest');

const swapi = new ApiSwgohHelp({
  "username": process.env.API_USERNAME,
  "password": process.env.API_PW
});

let list = [];

let options = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    "name"
  ]
};

let searchResult = [];
let fuse = new Fuse(list, options);
let emojis = [":crown:", ":second_place:", ":lizard:", ":poop:"];

module.exports.run = async (bot, message, args) => {

  let [arg1, arg2, arg3] = args;

  try {
    let payload = {
      "allycodes": process.env.SWGOH_ALLYCODES.split(","),
      "language": "eng_us"    }

    let payload2 = {
      "allycodes" : 282167359,
      "language": "eng_us" }

    let realNames = await swapi.fetchPlayer(payload2);
    realNames = realNames[0];

    let units = await swapi.fetchUnits(payload);

    realNames.roster.forEach((e) => {
          list.push({
            "name" : e.nameKey,
            "nameID" : e.defId,
          });
    });

    for (var i in units) {
      let searchString = args.toString().replace(/,/g," ");
      if (i === fuse.search(searchString)[0].nameID) {
        let unitName = fuse.search(searchString)[0].name;
        let sortList = [];
        let embed = {};

        for (var k = 0; k < units[i].length; k++) {
          sortList.push({
            "name": units[i][k].player,
            "gp": units[i][k].gp
          });
        }

        sortList.sort((a, b) => (a.gp < b.gp) ? 1 : (b.gp < a.gp) ? -1 : 0);

        embed.title = '**' + unitName + '**';
        embed.description = '------------------------------\n\n';

        var index = 0;

        for (var a in sortList) {
          embed.description += '**' + sortList[a].name + "** : " + sortList[a].gp;

          if (index < 3)
            embed.description += "   " + emojis.shift();

          if (index === sortList.length - 1)
            embed.description += emojis.shift();


          embed.description += "\n";
          index++;
        }
        emojis = [":crown:", ":second_place:", ":lizard:", ":poop:"];

        const m = await message.channel.send({
          embed
        });
      }
    }

    list = [];

  } catch (e) {
    throw e;
    }
}

module.exports.help = {
  name: "whtb"
}
