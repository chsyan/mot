import { GuildQueue, Player, useQueue } from "discord-player";
import { Client, CommandInteraction, GuildMember } from "discord.js";

let player: Player;

const checkMemberVoice = async (interaction: CommandInteraction) => {
    const member = interaction.member as GuildMember;
    if (!member) return false;
    const channel = member?.voice?.channel;
    if (!channel) {
        // Check if already replied
        if (interaction.replied)
            await interaction.editReply({ content: "You must be in a voice channel to use this command", embeds: [] });
        else await interaction.reply({ content: "You must be in a voice channel to use this command", embeds: [] });
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
    await player.play(queue.channel!, url);
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

export { checkMemberVoice, init, connect, playUrl, skip };
