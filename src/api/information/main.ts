import { Route, Server } from '../../classes';
import noblox from 'noblox.js';

export default class app extends Route {

    constructor(server: Server) {
        super(server)
        this.conf = {
            path: '/information'
        }
    }

    public bind() {
        this.router.get('/teams/:Id', async (req, res) => {
            if (!req.params.Id) {
                return res.status(400).json({ code: this.constants.codes.CLIENT_ERROR, message: this.constants.messages.CLIENT_ERROR});
            }
            const Id: number = Number(req.params.Id);
            const groups = await noblox.getGroups(Id);
            const mainRank = await noblox.getRankInGroup(13070896,Id);
            const teamsArray: string[] = [];

            if (mainRank == 20 || mainRank < 30) {
                teamsArray.push("Test Subjects");
                return res.status(200).json(teamsArray);
            }

            for (let group of groups) {
                if (!Object.keys(this.validTeams).includes(group.Id.toString())) continue;
                if (this.validTeams[group.Id])
                    teamsArray.push(this.validTeams[group.Id]);
            }
            if (mainRank >= 30) teamsArray.push("Foundation Personnel");

            if (mainRank >= 60) teamsArray.push("Executive Personnel");

            return res.status(200).json(teamsArray);

        })

        this.router.get('/groups/:Id', async (req, res) => {

        })
    }

    public validTeams = {
        13112313: "Mobile Task Forces",
        13193634: "Security Corps",
        13193599: "Scientific Department",
        13193780: "Medicinal Department",
        13193826: "Ethics Committee",
        13152418: "Engineering & Technical Services",
        13193646: "Combative Medical Unit",
        13193551: "Nuclear Engineering Branch",
        13459374: "Biohazard Control Division",
        13260869: "Acting Employees",
        14198829: "Department of External Affairs",
        14043320: "Janitorial Department",
        14255453: "Strategic Security Operations"
    }
}

