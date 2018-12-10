const Discord = require("discord.js");
const ApiSwgohHelp = require('api-swgoh-help');
const Fuse = require('fuse-js-latest');

const swapi = new ApiSwgohHelp({
  "username": process.env.API_USERNAME,
  "password": process.env.API_PW
});

var list;

var options = {
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

var searchResult = [];
var fuse = new Fuse(list, options);
var emojis = [":crown:", ":second_place:", ":lizard:", ":poop:"];

module.exports.run = async (bot, message, args) => {
  var foundUnit = false;

  let [arg1, arg2] = args;

  try {
    list = [];
    let payload = {
      "allycodes": process.env.SWGOH_ALLYCODES.split(","),
      "language": "eng_us"
    }

    let units = await swapi.fetchUnits(payload);
    for (var d in units) {
      list.push({
        "name": d
      });
    }

    console.log("Units loaded");



    for (var i in units) {
      if (i === fuse.search(arg1)[0].name) {

        foundUnit = true;
        var key = i;
        var sortList = [];
        let embed = {};

        for (var k = 0; k < units[key].length; k++) {
          sortList.push({
            "name": units[i][k].player,
            "gp": units[key][k].gp
          });
        }

        sortList.sort((a, b) => (a.gp < b.gp) ? 1 : (b.gp < a.gp) ? -1 : 0)

        embed.title = '**' + i + '**';
        embed.description = '------------------------------\n\n';

        var index = 0;

        for (var a in sortList) {
          embed.description += '**' + sortList[a].name + "** : " + sortList[a].gp;

          if (index < 3)
            embed.description += "   " + emojis.shift();

          if (index === test.length - 1)
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

    if (foundUnit === false) {
      const m = await message.channel.send("no Unit with name : " + arg1);
      foundUnit = false;
    }
  } catch (e) {
    throw e;
    }
}

module.exports.help = {
  name: "whtb"
}
