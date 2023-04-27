import { CommandInteraction } from "discord.js";
import { Command } from "./util";
import { skip } from "@/player";

const skipCommand: Command = {
    name: "skip",
    description: "Skip current song",
    execute: async (interaction: CommandInteraction) => {
        skip(interaction);
    },
};

export default skipCommand;
