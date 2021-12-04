import axios from 'axios';
import { inspect } from 'util';
import {CommandInteraction, Constants, Message} from 'eris';
import { Client, SlashCommand } from '../classes';

export default class test extends SlashCommand {
    constructor(client: Client) {
        super(client);
        this.name = 'test';
        this.description = 'Evaluates native JS code';
        this.aliases = ['e'];
        this.permissions = 10;
        this.enabled = true;
        this.guildOnly = false;
        this.slashCommand = true;
    }

    public async run(interaction) {
        await interaction.channel.createMessage('hi');
        await interaction.createMessage({
            content: 'Hey!',
            components: [
                {
                    type: Constants.ComponentTypes.ACTION_ROW,
                    components: [
                        {
                            type: Constants.ComponentTypes.BUTTON, // https://discord.com/developers/docs/interactions/message-components#buttons
                            style: Constants.ButtonStyles.PRIMARY, // This is the style of the button https://discord.com/developers/docs/interactions/message-components#button-object-button-styles
                            custom_id: "accept",
                            label: "Click me!",
                            disabled: false // Whether or not the button is disabled, is false by default}
                        }
                    ]
                }
            ],

        });
    }
}
