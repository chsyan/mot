import ytdl from "@distube/ytdl-core";
import ytsr from "ytsr";
import fs from "fs";

import {
    ApplicationCommandOptionType,
    CommandInteraction,
    EmbedBuilder,
    Message,
    MessageReaction,
    User,
} from "discord.js";
import { Command } from "./util";

import { inlineCode } from "discord.js";
import { numbers } from "@/emoji";

const query = async (interaction: CommandInteraction) => {
    const query = interaction.options.get("query")?.value as string;
    if (!query) {
        await interaction.reply("No query provided");
        return;
    }

    const message = await interaction.reply({ content: "Searching...", ephemeral: false, fetchReply: true });

    // Add reactions early since they are sequential and take time
    const reactPromises = [];
    for (const number of numbers) {
        reactPromises.push(message.react(number));
    }

    const results = await ytsr(query, { limit: 5 });
    let replyString = "";

    for (let i = 0; i < results.items.length; i++) {
        const result = results.items[i] as ytsr.Item;
        if (result.type !== "video") {
            continue;
        }

        replyString += `${numbers[i]}  [${result.title}](${result.url})\n\n`;
    }

    const selectionEmbed = new EmbedBuilder().setDescription(replyString);
    await interaction.editReply({
        content: `Search results for ${inlineCode(query)}`,
        embeds: [selectionEmbed],
    });

    // Ensure all reactions are added
    await Promise.all(reactPromises);

    const filter = (reaction: MessageReaction, user: User) =>
        numbers.includes(reaction.emoji.name || "") && user.id === interaction.user.id;
    const collected = (await message.awaitReactions({ filter, time: 6000, max: 1 })).first()?.emoji;
    if (!collected) {
        await interaction.editReply({
            content: `Error in reaction`,
        });
        return;
    }
    const index = numbers.indexOf(collected.toString());
    const item = results.items[index];
    if (item?.type !== "video") {
        await interaction.editReply({
            content: `Error in reaction`,
        });
        return;
    }

    // ytdl("https://www.youtube.com/watch?v=aqz-KE-bpKQ").pipe(fs.createWriteStream("video.mp4"));
    const audio = await ytdl(item.url, { filter: "audioonly" });

    interaction.editReply({
        content: `Queued ${inlineCode(item.title)}`,
        embeds: [],
    });
    message.reactions.removeAll();
};

const queryCommand: Command = {
    name: "query",
    description: "Query for a song",
    options: [
        {
            name: "query",
            description: "Query for a song",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    execute: async (interaction: CommandInteraction) => {
        query(interaction);
    },
};

export default queryCommand;
