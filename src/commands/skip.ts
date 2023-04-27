import { skip } from "@/player";
import { CommandInteraction } from "discord.js";
import { Command } from "./util";

const skipCommand: Command = {
    name: "skip",
    description: "Skip current song",
    execute: async (interaction: CommandInteraction) => {
        skip(interaction);
    },
};

export default skipCommand;
