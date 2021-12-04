import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { Server as HTTPServer } from 'http'
import {Client, Collection, Route} from '.';
import { main } from "../api/setrank";

export default class Server {
    public app: express.Application;

    public routes: Collection<Route>;

    public port: number;

    private root: string;

    protected parse: boolean;

    constructor( client: Client, port: number, routeRoot?: string, parse = true) {
        this.app = express();
        this.routes = new Collection<Route>();
        this.port = port;
        this.root = routeRoot;

        this.parse = parse;

        this.init();
        this.loadRoutes();
    }

    public async loadRoutes() {
        const route = new main(this);
        if (route.conf.maintenance) {
            route.maintenance();
        } else {
            route.init();
            route.bind();
        }
        console.log(`Successfully loaded route.`);
        this.routes.add(route.conf.path, route);
        this.app.use(route.conf.path, route.router);
        this.app.listen(this.port);
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
    }

    public listen(port: number): HTTPServer {
        return this.app.listen(port);
    }

}
