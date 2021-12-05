import { Route, Server } from '../../classes';

export default class app extends Route {

    constructor(server: Server) {
        super(server)
        this.conf = {
            path: '/setrank'
        }
    }

    public bind() {
        this.router.get('/', async (req, res) => {
            res.send('does this work?')
        })
    }
}

