import ytsr from "ytsr";

import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, MessageReaction, User } from "discord.js";
import { Command } from "./util";

import { numbers } from "@/emoji";
import { checkMemberVoice, playUrl } from "@/player";
import { inlineCode } from "discord.js";

const queryLimit = 10;
const queryShowLimit = 5;

const query = async (interaction: CommandInteraction) => {
    const query = interaction.options.get("song")?.value as string;
    if (!query) {
        await interaction.reply("No query provided");
        return;
    }

    const chann = await checkMemberVoice(interaction);
    if (!chann) return;

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
    const message = await interaction.reply({
        content: `Search results for ${inlineCode(query)}`,
        embeds: [selectionEmbed],
        ephemeral: false,
        fetchReply: true,
    });

    // Add reactions early since they are sequential and take time
    const reactPromises = [];
    for (const number of numbers) {
        reactPromises.push(message.react(number));
    }
    await Promise.all(reactPromises);

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

    message.reactions.removeAll();

    playUrl(interaction, item.url);
};

const queryCommand: Command = {
    name: "query",
    description: "Query and play a song",
    options: [
        {
            name: "song",
            description: "Query for a song",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    execute: async (interaction: CommandInteraction) => {
        query(interaction);
    },
};

export { query };
export default queryCommand;
