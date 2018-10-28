const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const ApiSwgohHelp = require('api-swgoh-help');
const Fuse = require('fuse-js-latest');
const bot = new Discord.Client();

const swapi = new ApiSwgohHelp({
  "username" : botconfig.username,
  "password" : botconfig.password
});

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

var data;
var list = [];

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online`);
  bot.user.setActivity("Swgoh");

  console.log("collect data");

  let payload = {
    "allycodes" : botconfig.members,
    "language" : "eng_us"
  }

  this.data =  await swapi.fetchUnits(payload);

  for(var d in this.data){
    list.push({
      "name" : d
    });
  }

});


var fuse = new Fuse(list, options);


bot.on("message", async message => {
  // This event will run on every single message received, from any channel.
  //to avoid loop
  if(message.author.bot) return;
  //only messages with prefix
  if(message.content.indexOf(botconfig.prefix) !== 0) return;

  const args = message.content.slice(botconfig.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
   m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }


  if(command === "whtb"){
    var foundUnit = false;
    let [arg1] = args;

    try {
        for(var i in this.data){

         if (i === fuse.search(arg1)[0].name){
           foundUnit = true;
           var key = i;
            console.log(i);

            var test = [];


            var msg = "";
            for(var k = 0; k < this.data[key].length; k++){
              test.push(
                {
                  "name" : this.data[i][k].player,
                  "gp" : this.data[key][k].gp});

            //  msg += this.data[i][k].player + " : " +  this.data[i][k].gp + "\n";
            }



            test.sort((a,b) => (a.gp < b.gp) ? 1 : (b.gp < a.gp) ? -1 : 0)

            for(var a in test){
            msg += test[a].name + " : " + test[a].gp + "\n";

            }

            const m = await message.channel.send(i + "\n" + msg);
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

});

bot.login(botconfig.token);
