const prefix = ".";

require('dotenv').config()

var fs = require('fs'); 
const fsPromises = require('fs').promises;

const web3 = require("web3");

const {
  Client,
  Intents
} = require('discord.js');

const bot = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

bot.on('ready', () => {
  console.log(`Bot ${bot.user.tag} is logged in!`);
});

bot.on('messageCreate', (message) => {
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.trim().split(/ +/g);
  const cmd = args[0].slice(prefix.length).toLowerCase(); // case INsensitive, without prefix

  if (cmd === 'add') {
    if (message.member.roles.cache.some(role => role.name === 'Cactus')) {
      var is = web3.utils.isAddress(args[1]);

      var add = web3.utils.toChecksumAddress(args[1]);

      if(is) {
        UpdateList(message, message.member.user.id, add);
      }
      else {
        message.reply({
          content: 'Invalid address, try submitting another.',
        })
      }
    }
    else {
      message.reply({
        content: "I'm sorry",
    })}
  }
})


const UpdateList = async (message, newMemberId, newAddress) => {
  var dict = [];

  await fs.promises.readFile("oglist.json")
  .then(function(result) {
    dict = JSON.parse(result);
  })
  .catch(function(error) {
    console.log(error);
  })

  var existing = false;

  for(var i = 0; i < dict.length; i++) {
    if(dict[i].member == newMemberId) {
      dict[i].address = newAddress;
      existing = true;
    }
  }

  if(!existing)
    dict.push({member: newMemberId, address: newAddress});

  if(!existing) {
    message.reply({
      content: 'Valid address. Welcome to the ELITES!',
    })
  }
  else {
    message.reply({
      content: 'You successfully updated your address.',
    })
  }

  await fsPromises.writeFile(
    "oglist.json", JSON.stringify(dict, null, 4));

  return existing;
}

bot.login(process.env.TOKEN);