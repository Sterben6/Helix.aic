import { Client, Event } from '../classes';
import * as commandFiles from '../commands';

export default class Ready extends Event {
    public client: Client;

    constructor(client: Client) {
        super(client);
        this.event = 'ready';
    }

    public async run() {
        console.log('ready');
        console.log(this.client.guilds.get('873559786833199186').id);
        await this.client.loadCommands(commandFiles);
        this.client.util.signale.start(`Client is now ready.`);
    }
}
