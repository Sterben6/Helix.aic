import { Config } from "../../types";
import eris, {Constants, Guild} from 'eris';
import pluris from 'pluris';
import mongoose, {CallbackWithoutResult} from 'mongoose';
import { Collection, Command, Event, Util, Server } from '.';

// @ts-ignore
pluris(eris)

export default class Client extends (eris.Client) {
    public config: Config;

    public commands: Collection<Command>;

    public events: Collection<Event>;

    public intervals: Collection<NodeJS.Timeout>;

    public server: Server;

    public util: Util;

    constructor(token: string, options?: eris.ClientOptions) {
        super(token, options);
        this.commands = new Collection<Command>();
        this.events = new Collection<Event>();
        this.intervals = new Collection<NodeJS.Timeout>();
        // this.server = new Server(this)
        this.util = new Util(this);
        this.server = new Server(this, 8124);

    }

    public async connectDb() {
        // @ts-ignore
        // await mongoose.connect(this.config.mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
    }

    public async loadCommands(commandFiles) {
        const cmdFiles = Object.values<typeof Command>(commandFiles);
        for (const cmd of cmdFiles) {
            const comm = new cmd(this);
            if (comm.subcmds.length) {
                for (const C of comm.subcmds) {
                    const Cmd: Command = new C(this)
                    comm.subcommands.add(Cmd.name, Cmd)
                    this.util.signale.success(`Loaded sub-command ${comm.name} ${Cmd.name}`)
                }
            }
            delete comm.subcmds;
            this.commands.add(comm.name, comm);
            const guilds: eris.Collection<Guild> = this.guilds;
            for (let [id, prop] of guilds) {
                const guild = guilds.get(id);
                const commands = await guild.getCommands();
                for (let comm of commands) {
                    try {
                        await guild.deleteCommand(comm.id);
                    } catch (e) {

                    }
                }
            }
            if (comm.slashCommand) {
                await this.guilds.get('914366368168681552').createCommand({
                    name: comm.name,
                    description: comm.description,
                    type: Constants.ApplicationCommandTypes.CHAT_INPUT
                })
            };
            this.util.signale.success(`Loaded ${comm.name} command.`);
        }
    }

    public async loadEvents(eventFiles: any) {
        const evntFiles = Object.entries<typeof Event>(eventFiles);
        for (const [name, ev] of evntFiles) {
            const event = new ev(this)
            this.events.add(event.event, event);
            this.on(event.event, event.run)
            this.util.signale.success(`Loaded ${name} event.`)
            delete require.cache[require.resolve(`${__dirname}/../events/${name}`)];
        }
    }
}
