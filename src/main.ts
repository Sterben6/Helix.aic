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
    const cookie = `_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_33E6968680620C4E239FF24DE55D85010B2EC55EBFF2A24BB00F5000E4A6DB1FEEE7B43164BCE613E97EC5D1ABE49547FD366E71CEF7060F4A640AF4DA3F7B2947CDFD33881F3DF67A72D9605450CA00995FD3B735BE00EFFE1781A9208A4E6E05B447DDFB4B8C1FC6F8CBF1F2140ACD59E178D610A525848ADE452FE62218DC2C3072BD6A0CF0016EC354E669C67C3D4131967B06464116992394815780482DEB4C79761DDB5917378B0461FC3BE3F25D9D7F48E8E7250127E4295163B35052ED07C8981653F2ACB7BAF28B6C54D5BD8AC46CCEF563E8799CAEDDEB415B9CD75F8D5CC9E8124B4201FC3E808DBA617506184A01225F3947AB2427B2A8656A94D22925175233951B790376419F1FC006114F2C629BE6631940D4A46379EEAB6851C9D02E02A0E83F2FB645CC2AA5A0692E722739E28F6C4ECA1144C4CD4CD755E895C8B33F503414873FDAE560A04AA9A7CEB9C0CBDD7CBDD61F38B9295FE1FAB71F5A3D`;
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
