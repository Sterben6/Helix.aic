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

    await noblox.setCookie(`_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_154B9A25C6EE22EC615F299E3003832D6AAB7D659B94DA51A206E953763A859C6FFB97F04913EB9A016EC86833B2F8C948A73FBE542795912CE15511958285C4336391A8E7F45751BD54F1805EC435966E1884375734640808602067DF1F5502AC4CCF36C2286CD940FCE94FB53907908A3AA546F40B11322966C2A6D626A75A495DD9B053812E79DE2C40238A47A92D372A6CC94A4BD1C38BD52F755400D91177AA5051C3C302760CBE56C34F6F53343D0254917ABD14C5AD448DD8B70AE4CCF931A62313D66573A3497506B68CA8DAD39C0023AAEE86735072D9F3A6AF16CEF3E0CFCBE8D67B33BB88569C2F67CB48F30E598B000104050607163702E71320D8C25FE3A83529FC68EAA038AAAB0C96E46B98F4DCF2578CB4384B918832F695D7B41F83509245140D51691C7EF3307D21FFB8AF06E8D9CEDC18AA5B3EB31BC27E13C0CCEEF9FE530328E81249C4E2088F2DAF93`)
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
