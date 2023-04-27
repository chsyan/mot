import { Client, GatewayIntentBits, IntentsBitField } from "discord.js";

require("dotenv").config();
const token = process.env.DISCORD_TOKEN;
if (!token) {
    console.log("No token found");
    process.exit(1);
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.login(token);
