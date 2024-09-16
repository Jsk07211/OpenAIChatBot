/** Initialize dotenv so we can access environment variables */
require('dotenv').config();

/** Imports from discord.js library */

/** Unpack  values from array/object into separate values */
/** Client refers to our bot */
const { Client, IntentsBitField } = require('discord.js');

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

/** client is our bot instance, so we can call our client */
client.login(process.env.DISCORD_API_KEY);


