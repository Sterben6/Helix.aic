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
        if (!(interaction instanceof eris.ComponentInteraction)) return;
        console.log(interaction.message);
        console.log(interaction.data.custom_id);
        await interaction.acknowledge();
    }
}
