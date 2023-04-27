import { Client, GatewayIntentBits } from "discord.js";
import ready from "./listeners/ready";
import interaction from "./listeners/interaction";
require("dotenv").config();

export const token = process.env.TOKEN || "";
if (!token) {
    console.log("No token found");
    process.exit(1);
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
});

ready(client);
interaction(client);

client.login(token);
