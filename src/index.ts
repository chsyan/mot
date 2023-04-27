import { Client, GatewayIntentBits } from "discord.js";
import interaction from "./listeners/interaction";
import ready from "./listeners/ready";
require("dotenv").config();

export const token = process.env.TOKEN || "";
if (!token) {
    console.log("No token found");
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

ready(client);
interaction(client);

client.login(token);
