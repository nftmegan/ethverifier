const prefix = "!";

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
    var is = web3.utils.isAddress(args[1]);

    if(!is) {
      message.reply({
        content: 'Invalid address. Only use eth addresses.',
      })
      return;
    }

    var addr = web3.utils.toChecksumAddress(args[1]);

    if (message.member.roles.cache.some(role => role.id == 871083305422979143)) {
      AddToList(message, "oglist", message.member.user.id, addr);
    }

    if (message.member.roles.cache.some(role => role.id == 871081562895163403)) {
      AddToList(message, "presale", message.member.user.id, addr);
    }
  }
});


const AddToList = async (message, list, memberId, address) => {
  var arr = [];

  await fs.promises.readFile(list + ".json")
  .then(function(result) {
    arr = JSON.parse(result);
  })
  .catch(function(error) {
    console.log(error);
  })

  var existing = false;

  for(var i = 0; i < arr.length; i++) {
    if(arr[i].member == memberId) {
      arr[i].address = address;
      existing = true;
    }
  }

  if(!existing) {
    arr.push({member: memberId, address: address});
  }

  await fsPromises.writeFile(
    list + ".json", JSON.stringify(arr, null, 4));

  if(!existing) {
    var msg = "You successfully whitelisted your address on the " + (list === "oglist" ? "OG Elites Whitelist" : "Pre-Sale Whitelist") + ".";
    message.reply({
      content: msg,
    })
  }
  else {
    var msg = "You succesfully updated your whitelisted address on the " + (list === "oglist" ? "OG Elites Whitelist" : "Pre-Sale Whitelist") + ".";
    message.reply({
      content: msg,
    })
  }

  return existing;
}

bot.login(process.env.TOKEN);