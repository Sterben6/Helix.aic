import eris, {Message, Member, TextChannel} from "eris";
import { Client, Event } from "../classes";
import noblox from 'noblox.js';
import components from 'eris-components';

export default class ClearanceApplication extends Event {
    public client: Client;

    constructor(client: Client) {
        super(client);
        this.event = 'messageReactionAdd';
    }

    public async run(message: Message, emoji: eris.Emoji, reactor: Member) {
        if (message.channel.id != "919715631501287505") return;
        let newMsg = message;
        if (!newMsg.embeds) {
            newMsg = await message.channel.getMessage(message.id);
        }
        if (!newMsg.embeds) return;
        if (emoji.id == "920485561976897566") return;

        const embed: eris.Embed = newMsg.embeds[0];
        const userId: number = Number(embed.footer.text);
        const levelType = this.titleToType[embed.title];

        const accepted = emoji.id == "925554530031116372";
        if (accepted) {
            try {
                await noblox.setRank(13070896, userId, this.typeToRank[levelType])
            } catch (e) {
                return;
            }
            const username = await noblox.getUsernameFromId(userId);
            const channel = this.client.guilds.get('914366368168681552').channels.get('925689294285328404');
            if (channel.type == 0) return await channel.createMessage(`Congrats ${username}! Your ${levelType} application has been accepted!`);
        } else {
            const username = await noblox.getUsernameFromId(userId);
            const channel = this.client.guilds.get('914366368168681552').channels.get('925689294285328404');
            if (channel.type == 0) return await channel.createMessage(`${username}, unfortunately your ${levelType} application has been denied.`);
        }


    }
    public titleToType = {
        "**__APP SUBMITTED: Level-1 Clearance__**": "Level-1",
        "**__APP SUBMITTED: Level-2 Clearance__**": "Level-2"
    }

    public typeToRank = {
        "Level-1": 30,
        "Level-2": 40
    }
}
