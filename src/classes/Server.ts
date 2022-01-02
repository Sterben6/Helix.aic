import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { Server as HTTPServer } from 'http'
import {Client, Collection, Route} from '.';
import { main } from "../api/setrank";
import { webhooks } from '../api/webhooks';
import { information } from "../api/information";

export default class Server {
    public app: express.Application;

    public routes: Collection<Route>;

    public port: number;

    private root: string;

    protected parse: boolean;

    private done: boolean;

    constructor( client: Client, port: number, routeRoot?: string, parse = true) {
        this.app = express();
        this.routes = new Collection<Route>();
        this.port = port;
        this.root = routeRoot;

        this.parse = parse;

        this.init();
        this.loadRoutes();
        this.done = false;
    }

    public async loadRoutes() {
        const routes = [new main(this), new webhooks(this), new information(this)];
        for (let route of routes) {
            if (route.conf.maintenance) {
                route.maintenance();
            } else {
                route.init();
                route.bind();
            }
            console.log(`Successfully loaded route: ${route.conf.path}.`);
            this.routes.add(route.conf.path, route);
            this.app.use(route.conf.path, route.router);
        }
    }

    public init() {
        if (this.parse) {
            this.app.use(bodyParser.json());
            this.app.use(bodyParser.urlencoded({ extended: true }))
        }
        this.app.set('trust proxy', 'loopback');
        this.app.use(helmet({
            hsts: false,
            hidePoweredBy: false,
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                },
            },
        }));
        this.listen(this.port)
    }

    private listen(port: number): HTTPServer {
        console.log('listen called')
        if (this.done == true) return;
        this.done = true;
        return this.app.listen(port);
    }

}
