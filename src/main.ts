import { promises as fs } from 'fs';
import { Client } from './classes';
import * as eventFiles from './events';
import * as commandFiles from './commands';
import { parse } from 'yaml';
import { Config } from '../types'; // eslint-disable-line
import noblox from 'noblox.js';
import components from "eris-components";

async function main(): Promise<void> {
    const read = await fs.readFile(process.cwd() + '/config.json', 'utf8');
    const config: Config = parse(read);
    const cookie = ``;
    const client = new Client(config.token, cookie);
    client.config = config;
    await client.loadEvents(eventFiles);
    // await client.loadCommands(commandFiles);
    // await client.connectDb();
    await noblox.setCookie(cookie);
    await client.connect();

    client.shards.get(0).on(`disconnect`, async function() {
        await this.client.shards.get(0).disconnect({
            reconnect: true
        });
    })

    client.on('error', async function(err) {
        client.util.signale.error(err)
    })

    process.on(`uncaughtException`, (err) => {
        client.util.signale.error(err)
    })

    process.on(`unhandledRejection`, (err) => {
        client.util.signale.error(err)
    })
}

main();
