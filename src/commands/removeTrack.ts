import { removeTrack, shuffleQueue } from "@/player";
import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Command } from "./util";

const removeTrackCommand: Command = {
    name: "remove",
    description: "Remove a track from the queue",
    execute: async (interaction: CommandInteraction) => {
        const index = interaction.options.get("index")?.value as number;
        removeTrack(interaction, index + 1);
    },
    options: [
        {
            name: "index",
            description: "Index to remove from queue",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
    ],
};

export default removeTrackCommand;
