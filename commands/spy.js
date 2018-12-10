const Discord = require("discord.js");
const ApiSwgohHelp = require('api-swgoh-help');

const swapi = new ApiSwgohHelp({
  "username": process.env.API_USERNAME,
  "password": process.env.API_PW
});


module.exports.run = async (bot, message, args) => {
  let [arg1, arg2] = args;

}

module.exports.help = {
  name: "spy"
}
