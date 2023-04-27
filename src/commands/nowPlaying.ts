import { nowPlaying } from "@/player";
import { CommandInteraction } from "discord.js";
import { Command } from "./util";

const nowPlayingCommand: Command = {
    name: "nowplaying",
    description: "Show current song",
    execute: async (interaction: CommandInteraction) => {
        nowPlaying(interaction);
    },
};

export default nowPlayingCommand;
