import { Route, Server } from '../../classes';
import noblox from 'noblox.js';

export default class app extends Route {

    constructor(server: Server) {
        super(server)
        this.conf = {
            path: '/setrank'
        }
    }

    public bind() {
        this.router.post('/', async (req, res) => {
            if (!req.headers.token)
                return res.status(401).json({ code: this.constants.codes.UNAUTHORIZED, message: this.constants.messages.PERMISSION_DENIED});
            if (!req.headers.group || !req.headers.userid || !req.headers.rank || !req.headers.reason)
                return res.status(400).json({ code: this.constants.codes.CLIENT_ERROR, message: this.constants.messages.CLIENT_ERROR});
            if (req.headers.token !== "e61e70d9-29ae-4dbc-8fc4-5b9fa2d6f470")
                return res.status(401).json({ code: this.constants.codes.UNAUTHORIZED, message: this.constants.messages.PERMISSION_DENIED});
            const group = req.headers.group;
            const userid = req.headers.userid;
            const rank = req.headers.rank;
            const reason = req.headers.reason;

            try {
                await noblox.setRank(group, userid, rank);
                return res.status(200).json({ code: this.constants.codes.SUCCESS, message: this.constants.messages.SUCCESS});
            } catch (e) {
                return res.status(500).json({ code: this.constants.codes.SERVER_ERROR, message: this.constants.messages.SERVER_ERROR});
            }
        })
    }
}

