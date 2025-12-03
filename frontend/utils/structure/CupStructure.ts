import {RoundNumber, Structure} from "@/utils/structure/Structure";
import {match, P} from "ts-pattern";

export default class CupStructure extends Structure {
    public isThereDay2() {
        return false
    }

    protected getRoundNumberData(): RoundNumber {
        return this.getRoundNumberDataCupOrChallenge()
    }

    protected getRoundNumberDataCupOrChallenge(challenge: boolean = false)
    {
        return match(this.tournamentPlayers)
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 4 && tournamentPlayers <= 8), (): RoundNumber => new RoundNumber(3, 0, challenge ? 0 : 0))
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 9 && tournamentPlayers <= 12), (): RoundNumber => new RoundNumber(4, 0, challenge ? 0 : 2))
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 13 && tournamentPlayers <= 20), (): RoundNumber => new RoundNumber(5, 0, challenge ? 0 : 2))
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 21 && tournamentPlayers <= 32), (): RoundNumber => new RoundNumber(5, 0, challenge ? 0 : 3))
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 33 && tournamentPlayers <= 64), (): RoundNumber => new RoundNumber(6, 0, challenge ? 0 : 3))
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 65 && tournamentPlayers <= 128), (): RoundNumber => new RoundNumber(7, 0, challenge ? 0 : 3))
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 129 && tournamentPlayers <= 226), (): RoundNumber => new RoundNumber(8, 0, challenge ? 0 : 3))
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 227 && tournamentPlayers <= 409), (): RoundNumber => new RoundNumber(9, 0, challenge ? 0 : 3))
            .otherwise((): RoundNumber => new RoundNumber(10, 0, 3))

    }

    public isPlayerInDay2(points: number) {
        return false
    }
}