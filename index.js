require('dotenv').config();
const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const ApiSwgohHelp = require('api-swgoh-help');
const Fuse = require('fuse-js-latest');
const bot = new Discord.Client();
const fs = require("fs");
bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

  if(err) {
	  console.log(err);
  }

  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });

});

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online`);
  bot.user.setActivity("Swgoh");

  console.log("collect data");
});


bot.on("message", async message => {
  // This event will run on every single message received, from any channel.
  //to avoid loop
  if(message.author.bot) return;
  //only messages with prefix
  if(message.content.indexOf(process.env.PREFIX) !== 0) return;

  const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  let commandFile = bot.commands.get(command);
  if(commandFile) commandFile.run(bot, message, args);
});

bot.login(process.env.BOT_TOKEN);
