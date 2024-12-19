const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, ActivityType } = require('discord.js');
const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')
require("dotenv").config()

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

require('../tools/videoCheck')(client);
require('../tools/twitchLiveCheck')(client);

let statusCont = 0
const status = [
	{ name: `aos seus comandos!`, type: ActivityType.Listening }, 
	{ name: `Também sou usado de cobaia de testes`, type: ActivityType.Custom },
	{ name: `você! (te dando asisstência)`, type: ActivityType.Watching },
	{ name: `Há uma chance deu cair agora`, type: ActivityType.Custom },
	{ name: `dados pra você!`, type: ActivityType.Streaming },
	{ name: `Não esqueça de seguir-nos!`, type: ActivityType.Custom },
	{ name: `JavaScript! :D`, type: ActivityType.Playing },
	{ name: `Já conhece nosso Telegram?`, type: ActivityType.Custom },
	{ name: `prol do anúncio!`, type: ActivityType.Competing },
	{ name: `Estamos produzindo pra você!`, type: ActivityType.Custom }
]

function changeStatus() {
	client.user.setPresence({
		activities: [status[statusCont]],
		status: '',
	});
	if(statusCont >= status.length-1){
		statusCont = 0
	} else {statusCont++}
}

function checkSleepyTime() {
    changeStatus();
}

setInterval(checkSleepyTime, 60 * 1000);

client.login(process.env.DISCORD_TOKEN);


const bot = new Telegraf(process.env.TELEGRAM_TOKEN)
require('../tools/videoCheck')(client, bot);
require('../tools/twitchLiveCheck')(client, bot);
require('../tools/sender')(client, bot);
bot.command('getid', (ctx) => ctx.reply(`ID: ${ctx.message.chat.id}`))

function launchBot() {
	bot.launch().then(() => {
	}).catch((err) => {
		console.error('Failed to launch the bot:', err)
		setTimeout(launchBot, 30000)
	});
}

try {
	launchBot()	
} catch (error) {
	console.log(" Telegram Bot is Online!")	
} 

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))