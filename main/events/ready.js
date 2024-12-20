const { Events, ActivityType } = require('discord.js');
const logEvent = require('../../utils/logger');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		logEvent(`Discord Bot is Online as "${client.user.tag}"!`, "success")
		client.user.setPresence({
			activities: [{ name: `aos seus comandos!`, type: ActivityType.Listening }],
			status: 'idle', // 'ABACATE' não é um status válido, use 'online', 'idle', 'dnd'
		});

		setInterval(() => client.videoCheck(), 5 * 1000);
		setTimeout(() => client.twitchLiveCheck(), 5 * 1000);
	},
};