import { showQueue } from "@/player";
import { CommandInteraction } from "discord.js";
import { Command } from "./util";

const showQueueCommand: Command = {
    name: "queue",
    description: "Show the current queue",
    execute: async (interaction: CommandInteraction) => {
        showQueue(interaction);
    },
};

export default showQueueCommand;
