import { Message, Member } from "eris";
import { Client, Event } from "../classes";
import eris from 'eris';
import noblox from 'noblox.js';
import components from 'eris-components';

export default class SlashCommand extends Event {
    public client: Client;

    constructor(client: Client) {
        super(client);
        this.event = 'interactionCreate';
    }

    public async run(interaction: eris.Interaction) {
        if (!(interaction instanceof eris.CommandInteraction)) return;
        const command = await this.client.util.resolveCommand(interaction.data.name);

        if (command.guildOnly && (interaction.channel.type !== 0)) return interaction.createMessage(`**This command may only be ran in a guild.**`);
        if (!command.enabled) return interaction.createMessage(`**This command has been disabled.**`);
        if (!command.checkPermissions(interaction.member)) return interaction.createMessage(`**You do not have access to this command.**`);

        try {
            // @ts-ignore
            await command.run(interaction)
        } catch(err) {
            // await this.client.util.handleError(err);
            console.log(err);
            await interaction.createMessage('An error occurred and has been logged!');
        }
        if (!interaction.acknowledged) await interaction.acknowledge();
    }
}
