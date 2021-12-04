import eris, { Message, Member } from "eris";
import { Client, Event } from "../classes";
import noblox from 'noblox.js';
import components from 'eris-components';

export default class LevelApplication extends Event {
    public client: Client;

    constructor(client: Client) {
        super(client);
        this.event = 'interactionCreate';
    }

    public async run(interaction: eris.Interaction) {
        if (!(interaction instanceof eris.ComponentInteraction)) return;
        if (interaction.message.channel.id != `909634938951831562`) return;





    }
}
