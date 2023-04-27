import { commands, loadCommands } from "@/commands/util";
import { Client } from "discord.js";

const ready = async (client: Client) => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            console.log("No client.user or client.application");
            return;
        }
        console.log("Logged in as " + client.user.tag);

        loadCommands(client.application, commands);
        console.log("Loaded commands");
    });
};

export default ready;
