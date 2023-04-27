import { CommandInteraction } from "discord.js";
import { Command } from "./util";

const pong = async (interaction: CommandInteraction) => {
    await interaction.reply("Pong!");
};

const pongCommand: Command = {
    name: "pong",
    description: "Pong!",
    execute: async (interaction: CommandInteraction) => {
        pong(interaction);
    },
};

export default pongCommand;
