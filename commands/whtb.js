const botconfig = require("../botconfig.json");
const Discord = require("discord.js");
const ApiSwgohHelp = require('api-swgoh-help');
const Fuse = require('fuse-js-latest');

const swapi = new ApiSwgohHelp({
  "username" : botconfig.username,
  "password" : botconfig.password
});

var list = [];

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

var fuse = new Fuse(list, options);

module.exports.run = async (bot, message, args) => {
    var foundUnit = false;
    let [arg1] = args;

    try {
		
	    let payload = {
	      "allycodes" : botconfig.members,
	      "language" : "eng_us"
	    }

	    let units =  await swapi.fetchUnits(payload);
	    for(var d in units){
	      list.push({
	        "name" : d
	      });
	    }
		
		console.log("Units loaded");
		
		
        for(var i in units){

         if (i === fuse.search(arg1)[0].name){
           foundUnit = true;
           var key = i;
            console.log(i);

            var test = [];
			
			let embed = {};
            for(var k = 0; k < units[key].length; k++){
              test.push(
                {
                  "name" : units[i][k].player,
                  "gp" : units[key][k].gp});

            //  msg += this.data[i][k].player + " : " +  this.data[i][k].gp + "\n";
            }



            test.sort((a,b) => (a.gp < b.gp) ? 1 : (b.gp < a.gp) ? -1 : 0)
			
			embed.title = '**'+i+'**';
			embed.description = '------------------------------\n\n';

            for(var a in test){
				embed.description += '**'+test[a].name + "** : " + test[a].gp + "\n";
            }

            const m = await message.channel.send({embed});
         }
       }

       if(foundUnit === false){
         const m = await message.channel.send("no Unit with name : " + arg1);
         foundUnit = false;
       }
    } catch(e) {
        throw e;
    }
}

module.exports.help = {
	name: "whtb"
}