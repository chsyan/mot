import { CommandInteraction } from "discord.js";
import { Command } from "./util";
import { nowPlaying, skip } from "@/player";

const nowPlayingCommand: Command = {
    name: "nowplaying",
    description: "Show current song",
    execute: async (interaction: CommandInteraction) => {
        nowPlaying(interaction);
    },
};

export default nowPlayingCommand;
