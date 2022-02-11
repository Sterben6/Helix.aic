import childProcess from 'child_process';
import { Client, Command, RichEmbed } from '.';
import noblox from 'noblox.js';
import signale from 'signale';
import { Member, Guild } from "eris";
import axios from "axios";

export default class Util {
    public client: Client;

    public signale: signale.Signale;

    private token: string;

    private token1: string;

    constructor(client: Client) {
        this.client = client;
        this.signale = signale;
        this.signale.config({
            displayData: true,
            displayTimestamp: true,
            displayFilename: true
        });
        this.init();
    }

    private async init() {
        let data;
        try {
            data = await axios.post(
                "https://auth.roblox.com/",
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Cookie: `.ROBLOSECURITY=${this.client.cookie}`,
                    }
                }
            );
        } catch(e){
            this.token = e.response.headers['x-csrf-token'];
        }
        this.token1 = this.token;
    }

    /**
     * Execute a terminal command
     * @param command - The command you wish to execute
     * @param options - useless shit tbh
     */
    public async exec(command: string, options: childProcess.ExecOptions = {}): Promise<string> {
        return new Promise((resolve, reject) => {
            childProcess.exec(command, options, (err, stdout, stderr) => {
                if (stderr) reject(new Error(`Command failed: ${command}\n${stderr}`));
                if (err) reject(err);
                resolve(stdout);
            });
        });
    }

    public resolveMember(query: string, { members }: Guild): Member | undefined {
        return members.find((m) => `${m.username}#${m.discriminator}` === query || m.username === query || m.id === query.replace(/[<@!>]/g, '') || m.nick === query) // Exact match for mention, username+discrim, username and user ID
            || members.find((m) => `${m.username.toLowerCase()}#${m.discriminator}` === query.toLowerCase() || m.username.toLowerCase() === query.toLowerCase() || (m.nick && m.nick.toLowerCase() === query.toLowerCase())) // Case insensitive match for username+discrim, username
            || members.find((m) => m.username.toLowerCase().startsWith(query.toLowerCase()) || (m.nick && m.nick.toLowerCase().startsWith(query.toLowerCase())));
    }

    /**
     * Resolve a command from a search word
     * @param search - The command you're searching for
     * @returns Promise<Command> - Returns the object of the command if found
     */
    public resolveCommand(search: string | string[]): Promise<Command> {
        let resolvedCommand: Command;
        const commandQuery = this.client.commands.toArray()
        if (typeof search === 'string') search = search.split(' ')
        resolvedCommand = commandQuery.find((command) => command.name === search[0].toLowerCase() || command.aliases.includes(search[0].toLowerCase()))
        console.log(search)
        if (!resolvedCommand) return Promise.resolve(null)
        search.shift()
        while (resolvedCommand.subcommands.size > 0 && search.length > 0) {
            const subCommand = resolvedCommand.subcommands.toArray();
            const found = subCommand.find((c) => c.name === search[0].toLowerCase() || c.aliases.includes(search[0].toLowerCase()))
            if (!found) break;
            resolvedCommand = found
            search.shift()
        }

        return Promise.resolve(resolvedCommand)
    }

    public async handleError(error: string): Promise<void> {

    }

    public splitString(string: string, length: number): string[] {
        if (!string) return [];
        if (Array.isArray(string)) string = string.join('\n');
        if (string.length <= length) return [string];
        const arrayString: string[] = [];
        let str: string = '';
        let pos: number;
        while (string.length > 0) {
            pos = string.length > length ? string.lastIndexOf('\n', length) : string.length;
            if (pos > length) pos = length;
            str = string.substr(0, pos);
            string = string.substr(pos);
            arrayString.push(str);
        }
        return arrayString;
    }

    public async setRank(target: number | string, newRank: number | string, groupId: number | string) {
        const res = await axios.patch(
            `https://groups.roblox.com/v1/groups/${groupId}/users/${target}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `.ROBLOSECURITY=${this.client.cookie}`,
                    'X-CSRF-TOKEN': this.token
                },
                body: JSON.stringify(newRank)
            }
        )
        if (res.data.statusCode !== 200)
            throw new Error(JSON.parse(res.data.body));
    }
}
