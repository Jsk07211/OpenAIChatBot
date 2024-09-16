require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

/** Define commands */
const commands = [
    new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Replies with hello!'),
    new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Returns an embed')
        .addStringOption(option => option.setName('text')
                                         .setDescription('Body Text')
                                         .setRequired(true)),
];

/** Register commands */
/** Async (because we use await, waiting for user response) anonymous function */
/** Use default REST settings */
const rest = new REST().setToken(process.env.DISCORD_API_KEY);

(async () => {
    try {
        // Register commands here
        console.log('Registering slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID, 
                process.env.SERVER_ID
            ),
            { body: commands }
        );

        console.log('Slash commands registered successfully!');
    } catch (error) {
        // Error handling
        console.log(`There was an error: ${error}`);
    }
})();