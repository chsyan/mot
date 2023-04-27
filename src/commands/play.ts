import { ApplicationCommandOptionType, CommandInteraction, inlineCode } from "discord.js";
import { Command } from "./util";
import { checkMemberVoice, playUrl } from "@/player";
import { useQueue } from "discord-player";

const playCommand: Command = {
    name: "play",
    description: "Play a song from url",
    execute: async (interaction: CommandInteraction) => {
        const url = interaction.options.get("url")?.value as string;
        await playUrl(interaction, url);
    },
    options: [
        {
            name: "url",
            description: "The url of the song to play",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
};

export default playCommand;
