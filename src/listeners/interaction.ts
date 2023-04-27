import { commands } from "@/commands/util";
import { Client } from "discord.js";

const interaction = async (client: Client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isChatInputCommand() || interaction.user.bot) {
            return;
        }

        // Get command from our registered commands
        const command = commands.find((command) => command.name === interaction.commandName);
        if (!command) {
            console.log("Unknown command");
            return;
        }
        command.execute(interaction);
    });
};

export default interaction;
