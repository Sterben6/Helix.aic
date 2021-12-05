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
    //await client.connectDb();

    await noblox.setCookie(`_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_FD0DD9510F9A33BCA03CDC0306B836FD85968A7E5BAF1254217BCB203118342AA668D66881F2F10F6089E7B7CD73AFBCBDB3D18AFF1ADF4984FCABDD8E8C5C44EBF27E2587B7B07BCB51A4458048857E606F031CC05F1EEC95DDA7700D5FD99D8ACD20DB073D15E2A4B47DA62382317CD5ECC28A0723A4BFA8207594D66BF972EE9F56FB2CF1568365200D415EA492B68EEC7155890038C8FB5A13C467E5306F87C3DBA505D912367CC58FC27A74DAB10EB9D0A8C953C764C4F724826858957EDE527CB2E84130E87D7DD5633AE7F1B6820C3D35EBC4ED39F7B0F17C7435DA579B54EAC35EA63E016EA9FF738692F13C65349E3DB9E244E79AF3FF3D8DD9E315396E2B5B3AC027DEFAE2B07858A6A26C6678939A1F8406B0AD69084BD0956F5DC1E116F15F386E95471C5D5EC1E363E25728114AA863B8BCE88DFA55086D31BB4BAC6E58227499A02AB9F7388A143332E0E5BF10`)
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
