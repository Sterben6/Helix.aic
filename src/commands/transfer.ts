import axios from 'axios';
import { inspect } from 'util';
import {CommandInteraction, Constants, Message} from 'eris';
import noblox from 'noblox.js';
import { Client, SlashCommand } from '../classes';

export default class transfer extends SlashCommand {
    constructor(client: Client) {
        super(client);
        this.name = 'transfer';
        this.description = 'Evaluates native JS code';
        this.permissions = 0;
        this.enabled = true;
        this.guildOnly = true;
        this.slashCommand = true;
    }

    public async run(interaction) {
        await interaction.createMessage('Checking group rank...');
        const data = (await axios.get(`https://api.blox.link/v1/user/${interaction.member.id}`)).data
        if (data.status == "error") return interaction.createFollowup('Please verify with bloxlink then try again.');
        const userid = parseInt(data.primaryAccount);
        const oldRank = await noblox.getRankInGroup(7428213, userid);
        const newRank = this.transferGroupRanks[oldRank];
        const arcRank = await noblox.getRankInGroup(13070896, userid);
        if (!newRank) return interaction.createFollowup(`You are not eligible for a rank transfer. If this is a mistake, contact OreoTec_h.`);
        if (newRank == arcRank) return interaction.createMessage('Your rank already matches your transfer rank.');
        await interaction.createMessage('Ranking...');
        try {
            await noblox.setRank(13070896, userid, newRank)
        } catch(e) {
            return await interaction.createMessage('An error occurred. Please try again later.')
        }
        await interaction.createMessage('You have been ranked!')

    }

    private transferGroupRanks = {
        220: 40,
        210: 40,
        200: 30
    }
}
