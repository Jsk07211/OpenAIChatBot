/** Initialize dotenv so we can access environment variables */
require('dotenv').config();

/** Imports from discord.js library */

/** Unpack  values from array/object into separate values */
/** Client refers to our bot */
const { Client, IntentsBitField, EmbedBuilder } = require('discord.js');

/** Takes in the intents object, everything else is optional */
/** Intents are a set of permissions the bot can use to get access to a set of events */
// https://discord.com/developers/docs/topics/gateway#gateway-intents
/** Each intent has a set of events accessible to bot, so we have to define it */
// A guild is a server

/**
 * We set bitflags to express our intents
 * 
 * Guilds: Server info (Can remove later)
 * GuildMemebers: Server member info (Can remove later)
 * GuildMessages: Server message info (required for chatbot!!)
 * MessageContent: Read permission for server messages (also required!)
 */
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})

/** client.on is a method with access to a list of events */
/** Listens when bot is ready, write a callback function, c is for client */
client.on('ready', (c) => {
    console.log(`${c.user.tag} is now running...`);
})

/** 
 * Triggered when new message is sent that is visible to bot
 *  This is why we need the correct intents! GuildMessages and MessageContent
 */
client.on('messageCreate', (message) => {
    /** Prevents bot from infinitely replying to itself */
    if (message.author.bot) {
        return
    }

    console.log(`${message.author.username}: ${message.content}`);

    if (message.content.includes('hello')) {
        message.reply(`Hello ${message.author.username}!`);
    }
})

/** Handle slash commands */
client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    console.log(interaction);
    /** Only run if input was a slash command */
    /** === is faster than ==, not type conversion */
    if (interaction.commandName === 'hello') {
        interaction.reply(`Hello ${interaction.user.username}!`);
    }

    if (interaction.commandName === 'embed') {
        /** Chain methods to define shape of embed */
        const text = interaction.options.get('text').value;

        const embed = new EmbedBuilder().setTitle(`${interaction.user.username}`)
                                        .setDescription(`${text}`)
                                        .setColor('Random');
        interaction.reply({ embeds: [embed] })
    }
})

/** Listen to messages instead */
client.on('messageCreate', (message) => {
    if (message.content === 'embed') {
        const embed = new EmbedBuilder().setTitle(`${message.author.username}`)
                                        .setDescription('This is an embed!')
                                        .setColor('Random');
        message.reply({ embeds: [embed] });
    }
})

/** client is our bot instance, so we can call our client, bot should be online now */
client.login(process.env.DISCORD_API_KEY);