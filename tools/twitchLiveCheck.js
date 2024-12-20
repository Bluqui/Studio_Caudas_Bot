const { Twitch } = require("@voidpkg/social-alert");
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const logEvent = require('../utils/logger');

const ultimaLive = null

module.exports = (client, bot) => {
    client.twitchLiveCheck = async () => {
        try {
            const guild = await client.guilds.fetch('508850110969413632').catch(console.error); //508850110969413632
            const channel = await guild.channels.fetch('1041581919688720467').catch(console.error); //1041581919688720467

            const twitch = new Twitch({
                //channel: 'studiocaudas'
                channels: ['ralisco'],
                liveChannels: [],
                interval: 90000,
                client: {
                    id: process.env.TWITCH_CLIENT_ID, // Get from: https://dev.twitch.tv
                    secret: process.env.TWITCH_CLIENT_SECRET, // Get from: https://dev.twitch.tv
                    token: process.env.TWITCH_TOKEN, // After entering the ID and SECRET, run it and check your console, a token will be automatically generated for you. So you can leave this blank.
                }
            });

            logEvent("Twitch API connection is ok!", "success")

            const filePath = path.join(__dirname, 'live.json');
            const rawData = fs.readFileSync(filePath, 'utf8');
            const jsonData = JSON.parse(rawData);

            //twitch.addChannel();
            twitch.on('live', (stream) => {

                if (jsonData.id !== stream.id) {
                    fs.writeFileSync(filePath, JSON.stringify({ id: stream.id }));

                    const embed = new EmbedBuilder({
                        title: stream.title,
                        description: "Studio Caudas está em live agora mesmo! ^^",
                        url: `https://www.twitch.tv/${stream.user_login}`,
                        timestamp: Date.now(),
                        image: {
                            url: stream.thumbnail_url.replace('{width}', '640').replace('{height}', '360'),
                        },
                        author: {
                            name: stream.user_login,
                            iconURL:
                                'https://yt3.googleusercontent.com/WwnsPTSVrzAhImIpff3oowku1hhLlOfaHYUPFiKWpBZdYnv1niokyrptzicQJv60SatAZTMrUA=s160-c-k-c0x00ffffff-no-rj',
                            url: 'https://www.youtube.com/@STUDIOCAUDAS/?sub_confirmation=1',
                        },
                        footer: {
                            text: stream.game_name,
                            iconURL: client.user.displayAvatarURL(),
                        },
                    });
    
                    logEvent(`Nova live na Twitch detectada: \n "${stream.title}" \n Enviado notificação no Discord e Telegram`, "info")
    
                    //bot.telegram.sendMessage(5474255947, "Uma nova live foi iniciada no canal da Twitch! Gostaria de divulgar ela?");
    
                    /*const canalDoLunar = -1001156955497
                    const furryArteRPG = -1001384735750
                    const studioCaudas = -1001334148893
                    const comentarioChamada = {
                        caption: `Studio Caudas está em live agora mesmo! ^^ \nVem nos dar um oi!\n\n\n[${stream.title}](https://www.twitch.tv/${stream.user_login})\n${stream.game_name}`,
                        parse_mode: 'Markdown'
                    }
    
                    channel.send({ content: "@everyone", embeds: [embed] })
                    .then(async message => {
    
                    await bot.telegram.sendPhoto(canalDoLunar, stream.thumbnail_url.replace('{width}', '640').replace('{height}', '360'), comentarioChamada)
                    await bot.telegram.sendPhoto(furryArteRPG, stream.thumbnail_url.replace('{width}', '640').replace('{height}', '360'), comentarioChamada)
                    await bot.telegram.sendPhoto(studioCaudas, stream.thumbnail_url.replace('{width}', '640').replace('{height}', '360'), comentarioChamada)
                    }).catch(console.error);*/

                }

            });
            
            twitch.on('offline', (stream) => { 
                console.log('live off');
            }); 
        } catch (error) {
            console.error("Erro ao executar o código:", error);
        }
    }
}