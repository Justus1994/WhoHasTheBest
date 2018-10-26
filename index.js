const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const ApiSwgohHelp = require('api-swgoh-help');

const swapi = new ApiSwgohHelp({
  "username" : botconfig.username,
  "password" : botconfig.password
});

const bot = new Discord.Client();
bot.on("ready", async () => {
  console.log(`${bot.user.username} is online`);
  bot.user.setActivity("Swgoh");
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
    let[arg1, arg2] = args;
    if(arg1 === "help")
    {
    const m = await message.channel.send("Example command: !whtb Embo");
    }
    else if(arg1)
    {
    arg1 = arg1.charAt(0).toUpperCase() + arg1.slice(1);
    const m = await message.channel.send("Niko has the best " +   `${arg1}`);
    }
    else{
    const m = await message.channel.send("Bad command use !whtb help for an example");
    }
  }
});
bot.login(botconfig.token);
