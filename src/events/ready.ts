import { Client, Event } from '../classes';
import * as commandFiles from '../commands';

export default class Ready extends Event {
    public client: Client;

    constructor(client: Client) {
        super(client);
        this.event = 'ready';
    }

    public async run() {
        await this.client.loadCommands(commandFiles);
        this.client.util.signale.start(`Client is now ready.`);
    }
}
