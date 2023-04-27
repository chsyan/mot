import ytsr from "ytsr";

import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, MessageReaction, User } from "discord.js";
import { Command } from "./util";

import { numbers } from "@/emoji";
import { checkMemberVoice, playUrl } from "@/player";
import { inlineCode } from "discord.js";

const queryLimit = 10;
const queryShowLimit = 5;

const play = async (interaction: CommandInteraction) => {
    const query = interaction.options.get("query")?.value as string;
    if (!query) {
        await interaction.reply("No query provided");
        return;
    }

    const chann = await checkMemberVoice(interaction);
    if (!chann) return;

    const message = await interaction.reply({ content: "Searching...", ephemeral: false, fetchReply: true });

    // Add reactions early since they are sequential and take time
    const reactPromises = [];
    for (const number of numbers) {
        reactPromises.push(message.react(number));
    }

    const results = await ytsr(query, { limit: queryLimit });
    let replyString = "";

    const videoResults: ytsr.Video[] = [];
    for (const result of results.items) {
        if (result.type !== "video") {
            continue;
        }
        videoResults.push(result);
    }
    const showLimit = Math.min(queryShowLimit, videoResults.length);
    for (let i = 0; i < showLimit; i++) {
        const result = videoResults[i]!;
        replyString += `${numbers[i]}  [${result.title}](${result.url})  [${result.duration}]\n\n`;
    }

    const selectionEmbed = new EmbedBuilder().setDescription(replyString);
    await interaction.editReply({
        content: `Search results for ${inlineCode(query)}`,
        embeds: [selectionEmbed],
    });

    const filter = (reaction: MessageReaction, user: User) =>
        numbers.includes(reaction.emoji.name || "") && user.id === interaction.user.id;
    const collected = (await message.awaitReactions({ filter, time: 100000, max: 1 })).first()?.emoji;
    if (!collected) {
        await interaction.editReply({
            content: `Timed out...`,
            embeds: [],
        });
        return;
    }
    const index = numbers.indexOf(collected.toString());
    const item = results.items[index];
    if (item?.type !== "video") {
        await interaction.editReply({
            content: `Error in retrieving url`,
            embeds: [],
        });
        return;
    }

    // ytdl("https://www.youtube.com/watch?v=aqz-KE-bpKQ").pipe(fs.createWriteStream("video.mp4"));

    interaction.editReply({
        content: `Queued ${inlineCode(item.title)}`,
        embeds: [],
    });
    message.reactions.removeAll();

    playUrl(interaction, item.url);
};

const playCommand: Command = {
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
        play(interaction);
    },
};

export default playCommand;
