import { shuffleQueue } from "@/player";
import { CommandInteraction } from "discord.js";
import { Command } from "./util";

const shuffleQueueCommand: Command = {
    name: "shuffle",
    description: "shuffle the current queue",
    execute: async (interaction: CommandInteraction) => {
        shuffleQueue(interaction);
    },
};

export default shuffleQueueCommand;
