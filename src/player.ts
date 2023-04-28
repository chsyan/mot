import { GuildQueue, Player, useQueue } from "discord-player";
import { Client, CommandInteraction, EmbedBuilder, GuildMember, inlineCode } from "discord.js";

let player: Player;

const checkMemberVoice = async (interaction: CommandInteraction) => {
    const member = interaction.member as GuildMember;
    if (!member) return false;
    const channel = member?.voice?.channel;
    if (!channel) {
        // Check if already replied
        if (interaction.replied)
            await interaction.editReply({ content: "You must be in a voice channel to use this command", embeds: [] });
        else
            await interaction.reply({
                content: "You must be in a voice channel to use this command",
                embeds: [],
                ephemeral: true,
            });
    }
    return channel;
};

const init = async (cli: Client<boolean>) => {
    if (player) return;
    player = new Player(cli);
    await player.extractors.loadDefault();
};

const connect = async (interaction: CommandInteraction) => {
    if (!interaction.isCommand()) return false;
    if (!player) await init(interaction.client);

    const channel = await checkMemberVoice(interaction);
    if (!channel) return false;

    player.queues.create(interaction.guildId!);
    const queue: GuildQueue = useQueue(interaction.guildId!)!;
    if (!queue.connection) {
        await queue.connect(channel, { deaf: false });
    }
    return true;
};

const playUrl = async (interaction: CommandInteraction, url: string) => {
    const conn = await connect(interaction);
    if (!conn) return;
    const queue: GuildQueue = useQueue(interaction.guildId!)!;
    const { track } = await player.play(queue.channel!, url);
    if (interaction.replied)
        await interaction.editReply({
            content: `Queued ${inlineCode(track.title!)}`,
            embeds: [],
        });
    else
        await interaction.reply({
            content: `Queued ${inlineCode(track.title!)}`,
            embeds: [],
        });
};

const skip = async (interaction: CommandInteraction) => {
    const channel = await checkMemberVoice(interaction);
    if (!channel) return;
    const queue = useQueue(interaction.guildId!);
    if (!queue) {
        await interaction.reply({ content: "Empty queue, nothing skipped", embeds: [] });
        return;
    }
    await queue.node.skip();
    await interaction.reply({ content: "Skipped", embeds: [] });
};

const nowPlaying = async (interaction: CommandInteraction) => {
    const channel = await checkMemberVoice(interaction);
    if (!channel) return;
    const queue = useQueue(interaction.guildId!);
    if (!queue) {
        await interaction.reply({ content: "Empty queue", ephemeral: true });
        return;
    }

    const currentTrack = queue.currentTrack!;
    await interaction.reply({ content: `Now playing: ${inlineCode(currentTrack.title)}`, ephemeral: true });
};

const showQueue = async (interaction: CommandInteraction) => {
    const channel = await checkMemberVoice(interaction);
    if (!channel) return;
    const queue = useQueue(interaction.guildId!);
    if (!queue || queue.tracks.size === 0) {
        await interaction.reply({ content: "Empty queue", ephemeral: true });
        return;
    }

    const currentTrack = queue.currentTrack!;
    const tracks = queue.tracks.toArray();
    let replyString = "";
    for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i]!;
        replyString += `${i + 1}. ${track.title}\n`;
    }

    const selectionEmbed = new EmbedBuilder().setDescription(replyString);
    await interaction.reply({
        content: `Now playing: ${inlineCode(currentTrack.title)}\n\nCurrent queue (${tracks.length} songs):`,
        embeds: [selectionEmbed],
        ephemeral: true,
    });
};

const shuffleQueue = async (interaction: CommandInteraction) => {
    const channel = await checkMemberVoice(interaction);
    if (!channel) return;
    const queue = useQueue(interaction.guildId!);
    if (!queue) {
        await interaction.reply({ content: "Empty queue", ephemeral: true });
        return;
    }

    queue.tracks.shuffle();

    await showQueue(interaction);
};

const removeTrack = async (interaction: CommandInteraction, index: number) => {
    const channel = await checkMemberVoice(interaction);
    if (!channel) return;
    const queue = useQueue(interaction.guildId!);
    if (!queue) {
        await interaction.reply({ content: "Empty queue", ephemeral: true });
        return;
    }

    const track = queue.removeTrack(index);
    if (!track) {
        await interaction.reply({ content: "Invalid index", ephemeral: true });
        return;
    }

    await interaction.reply({ content: `Removed ${inlineCode(track.title)}` });
};

export { checkMemberVoice, init, connect, playUrl, skip, nowPlaying, showQueue, shuffleQueue, removeTrack };
