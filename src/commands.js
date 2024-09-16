require('dotenv').config();
const { REST, Routes } = require('discord.js');

/** Define commands */
const commands = [
    {
        name: 'hello',
        description: 'Replies with hello!',
    },
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