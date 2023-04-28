import { playUrl } from "@/player";
import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Command } from "./util";
import { validateURL } from "@distube/ytdl-core";
import { query } from "./query";

const playCommand: Command = {
    name: "play",
    description: "Play a song",
    execute: async (interaction: CommandInteraction) => {
        const url = interaction.options.get("song")?.value as string;
        if (validateURL(url)) {
            await playUrl(interaction, url);
        } else {
            await query(interaction);
        }
    },
    options: [
        {
            name: "song",
            description: "The url or name of the song to play",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
};

export default playCommand;
