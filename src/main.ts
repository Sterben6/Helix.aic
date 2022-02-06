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
    const client = new Client(config.token);
    client.config = config;
    await client.loadEvents(eventFiles);
    // await client.loadCommands(commandFiles);
    // await client.connectDb();

    await noblox.setCookie(`_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_26457C9B8717FF75BFA7562E01322355A7C30A2F76A71B959025905775CF5129D8C5784D41A35C89A2723543ED3064A8E74FBD1C41F01BB625C779AD6AC6C97343A6C60F72F28611740A7E868C09ABB5A027F07F8010ED86B37FDA27DDC767CFEFA1926BD1174F71A4270BD5854406480EA642265084DF2AFDAF9CF3D1CBC28A4B54CBB34BFA5A37F6FD46A217AF44E9AA3E42C4303E070255D94D0B299B2BE60009C82E6E7BE4645128C5767078956B67F3801337DCFD52046B65D1DDAF31876CF68EA6CD8AF426B3B640EA2F36D6778FA65C44C773DCA39F8CA0E239768D783909A43747F1C7670CF6A06745C9B269E9696989FB071A06F0EF382C9385E70B43F42ACF47D96C54A9787CBEE50A7F7FB94D64DEB8CE1ACEA19BA63F53A478C76616D10D5CD755481826C565B74026FDFEAAD8132685C4707424A3FBE35D0335FAD13533E7009C95E42A42C4916AF91CC99EECAC`, false)
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
