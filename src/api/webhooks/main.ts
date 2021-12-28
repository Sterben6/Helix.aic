import { Route, Server } from '../../classes';
import axios from "axios";

export default class activity extends Route {

    constructor(server: Server) {
        super(server)
        this.conf = {
            path: '/webhooks'
        }
    }

    public bind() {
        this.router.post('/:id/:token', async (req, res) => {
            if (!req.headers.token)
                return res.status(401).json({ code: this.constants.codes.UNAUTHORIZED, message: this.constants.messages.PERMISSION_DENIED});
            if (req.headers.token !== "e61e70d9-29ae-4dbc-8fc4-5b9fa2d6f470")
                return res.status(401).json({ code: this.constants.codes.UNAUTHORIZED, message: this.constants.messages.PERMISSION_DENIED});
            axios.post(`https://discord.com/api/webhooks/${req.params.id}/${req.params.token}`, req.body).then(result => {
                res.send(result.data);
            }).catch(err => {
                res.status(err.response.status).send(err.response.data);
            })
        })
    }
}

