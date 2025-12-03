import {RoundNumber, Structure} from "@/utils/structure/Structure";
import {match, P} from "ts-pattern";

export default class Reg202520241117Structure extends Structure {
    public isThereDay2() {
        return this.tournamentPlayers >= 1 // https://community.pokemon.com/en-us/discussion/14298/2025-championship-series-mid-season-update-nov-11-2024/p1?new=1
    }

    protected getRoundNumberData(): RoundNumber {
        return match(this.tournamentPlayers)
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 4 && tournamentPlayers <= 8), (): RoundNumber => new RoundNumber(3, 0, -1))
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 9 && tournamentPlayers <= 16), (): RoundNumber => new RoundNumber(4, 0, -1))
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 17 && tournamentPlayers <= 32), (): RoundNumber => new RoundNumber(6, 0, -1))
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 33 && tournamentPlayers <= 64), (): RoundNumber => new RoundNumber(7, 0, -1))
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 65 && tournamentPlayers <= 128), (): RoundNumber => new RoundNumber(6, 2, -1))
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 129 && tournamentPlayers <= 256), (): RoundNumber => new RoundNumber(7, 2, -1))
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 257 && tournamentPlayers <= 512), (): RoundNumber => new RoundNumber(8, 2, -1))
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 513 && tournamentPlayers <= 1024), (): RoundNumber => new RoundNumber(8, 3, -1))
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 1025 && tournamentPlayers <= 2048), (): RoundNumber => new RoundNumber(8, 4, -1))
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 2049 && tournamentPlayers <= 4096), (): RoundNumber => new RoundNumber(9, 4, -1))
            .otherwise((): RoundNumber => new RoundNumber(9, 5, -1))
    }

    public isPlayerInDay2(points: number) {
        return this.isThereDay2() && points >= match(this.tournamentPlayers)
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 1 && tournamentPlayers <= 64), () => 9999)
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 65 && tournamentPlayers <= 128), () => 10)
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 129 && tournamentPlayers <= 256), () => 13)
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 257 && tournamentPlayers <= 512), () => 16)
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 513 && tournamentPlayers <= 1024), () => 16)
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 1025 && tournamentPlayers <= 2048), () => 16)
            .with(P.when((tournamentPlayers) => tournamentPlayers >= 2049 && tournamentPlayers <= 4096), () => 19)
            .otherwise(() => 19)
    }
}