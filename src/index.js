import OpenAI from 'openai';
import dotenv from 'dotenv';
import { Client, IntentsBitField, EmbedBuilder } from 'discord.js';

/** Initialize dotenv so we can access environment variables */
dotenv.config();

/** Imports from discord.js library */

/** Unpack  values from array/object into separate values */
/** Client refers to our bot */
// const { Client, IntentsBitField, EmbedBuilder } = require('discord.js');

/** Takes in the intents object, everything else is optional */
/** Intents are a set of permissions the bot can use to get access to a set of events */
// https://discord.com/developers/docs/topics/gateway#gateway-intents
/** Each intent has a set of events accessible to bot, so we have to define it */
// A guild is a server

/**
 * We set bitflags to express our intents
 * 
 * Guilds: Server info (Can remove later)
 * GuildMembers: Server member info (Can remove later)
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

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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

async function generateMessage(textPrompt) {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: 'You are a college student answering your classmate.',
            },
            {
                role: 'user',
                content: textPrompt,
            },
        ],
    });
    return response.choices[0].message;
}

async function generateImage(imagePrompt) {
    const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: imagePrompt,
        size: "1024x1024",
        quality: "standard",
        n: 1,
    })
    console.log(response);
    return response.data[0].url;
}

/** Handle slash commands */
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.channel.id !== process.env.CHANNEL_ID) return;

    if (interaction.commandName === 'embed') {
        await interaction.deferReply();
        try {
            const prompt = interaction.options.get('text').value;
            const image = await generateImage(prompt);
            /** Chain methods to define shape of embed */
            const text = interaction.options.get('text').value;
            const embed = new EmbedBuilder().setTitle(`${interaction.user.username}`)
                                            .setDescription(`${prompt}`)
                                            .setImage(image)
                                            .setColor('Random');
            await interaction.editReply({ embeds: [embed] });
        } catch (e) {
            console.log("Error occurred: ", e);
            return await interaction.editReply('I\'m fresh out of images...');
        }
    }    

    if (interaction.commandName === 'ama') {
        /** Send typing status */
        await interaction.deferReply();
        const prompt = interaction.options.get('text').value;

        try {
            const response = await generateMessage(prompt);
            await interaction.editReply(response);
        } catch (e) {
            console.log("Error occurred: ", e);
            return await interaction.editReply('You\'ve stumped me D:');
        }
    }
})

/** client is our bot instance, so we can call our client, bot should be online now */
client.login(process.env.DISCORD_API_KEY);