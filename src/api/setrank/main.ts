import { Route, Server } from '../../classes';

export default class app extends Route {

    constructor(server: Server) {
        super(server)
        this.conf = {
            path: '/setrank'
        }
    }

    public bind() {
        this.router.post('/', async (req, res) => {
            console.log('called');
            console.log("body: " + JSON.stringify(req.body));
            console.log(req.headers['Test']);
            console.log(req.headers);
            if (req.headers.Test == "00") {
                console.log('test')
            }
        })
    }
}

