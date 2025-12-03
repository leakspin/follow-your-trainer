import {RoundNumber, Structure} from "@/utils/structure/Structure";
import {match, P} from "ts-pattern";

export default class Worlds2024Structure extends Structure {
    public isThereDay2() {
        return this.tournamentPlayers >= 1 // https://worlds.pokemon.com/en-us/in-person/tournament-info/tcg/
    }

    protected getRoundNumberData(): RoundNumber {
        return match(this.tournamentPlayers)
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 1 && tournamentPlayers <= 128), (): RoundNumber => new RoundNumber(6, 2, -1))
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 129 && tournamentPlayers <= 256), (): RoundNumber => new RoundNumber(7, 2, -1))
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 257 && tournamentPlayers <= 512), (): RoundNumber => new RoundNumber(8, 2, -1))
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 513 && tournamentPlayers <= 1024), (): RoundNumber => new RoundNumber(8, 3, -1))
            .otherwise((): RoundNumber => new RoundNumber(8, 4, -1))
    }

    public isPlayerInDay2(points: number) {
        return this.isThereDay2() && points >= match(this.tournamentPlayers)
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 1 && tournamentPlayers <= 128), () => 12)
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 129 && tournamentPlayers <= 256), () => 15)
            .otherwise(() => 18)
    }
}