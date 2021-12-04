import { Router, Request, Response } from 'express';
import { Server } from '.';

export default class Route {
    public server: Server;

    public conf: { path: string; deprecated?: boolean; maintenance?: boolean; };

    public router: Router;

    constructor(server: Server) {
        this.server = server;
        this.conf = { path: '' };
        this.router = Router();
    }

    public bind() {}

    public init() {
        this.router.all('*', (req, res, next) => {
            if (this.conf.maintenance === true) res.status(503).json({ code: this.constants.codes.MAINTENANCE_OR_UNAVAILABLE, message: this.constants.messages.MAINTENANCE_OR_UNAVAILABLE });
            else next();
        });
    }


    public maintenance(): void {
        this.router.all('*', (_req, res) => {
            res.status(503).json({ code: this.constants.codes.MAINTENANCE_OR_UNAVAILABLE, message: this.constants.messages.MAINTENANCE_OR_UNAVAILABLE });
        });
    }

    public handleError(error: Error, res: Response) {
        res.status(500).json({ code: this.constants.codes.SERVER_ERROR, message: this.constants.messages.SERVER_ERROR });
        console.log(error);
    }

    get constants() {
        return {
            codes: {
                SUCCESS: 200,
                UNAUTHORIZED: 401,
                CLIENT_ERROR: 400,
                SERVER_ERROR: 500,
                MAINTENANCE_OR_UNAVAILABLE: 503,
            },
            messages: {
                SUCCESS: ['OK', 'Request was processed and accepted.'],
                PERMISSION_DENIED: ['PERMISSION_DENIED', 'You do not have valid credentials to access this resource.'],
                CLIENT_ERROR: ['CLIENT_ERROR', 'An invalid parameter was provided.'],
                SERVER_ERROR: ['INTERNAL_ERROR', 'An internal error has occurred, an error log has been created.'],
                MAINTENANCE_OR_UNAVAILABLE: ['SERVICE_UNAVAILABLE', 'The endpoint or resource you\'re trying to access is either in maintenance or is not available.'],
            },
        };
    }
}
