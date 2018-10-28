const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const ApiSwgohHelp = require('api-swgoh-help');

const swapi = new ApiSwgohHelp({
  "username" : botconfig.username,
  "password" : botconfig.password
});

var data;

const bot = new Discord.Client();

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online`);
  bot.user.setActivity("Swgoh");

  console.log("collect data");

  let payload = {
    "allycodes" : botconfig.members,
    "language" : "eng_us"
  }

  this.data =  await swapi.fetchUnits(payload);

});




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
         if (i === arg1.toUpperCase()){
           foundUnit = true;
           var key = i;
            console.log(i);

            var test = [];
            var test2 = [];

            var msg = "";
            for(var k = 0; k <= botconfig.MemberCount; k++){
              test.push(this.data[key][k].player);
              test2.push(this.data[key][k].gp);
              msg += this.data[i][k].player + " : " +  this.data[i][k].gp + "\n";
            }

            const m = await message.channel.send(i + ": \n" + msg);
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
