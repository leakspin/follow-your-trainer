import {match} from "ts-pattern";

export class RoundNumber {
    dayOne: number
    dayTwo: number
    singleElimination: number
    swissRoundsTotal: number
    total: number

    constructor(dayOne: number, dayTwo: number, singleElimination: number) {
        this.dayOne = dayOne
        this.dayTwo = dayTwo
        this.singleElimination = singleElimination
        this.swissRoundsTotal = this.dayOne + this.dayTwo
        this.total = this.dayOne + this.dayTwo + this.singleElimination;
    }
}

export abstract class Structure {
    tournamentPlayers: number
    roundNumber: RoundNumber

    constructor(tournamentPlayers: number) {
        this.tournamentPlayers = tournamentPlayers

        this.roundNumber = this.getRoundNumberData()
    }

    public getRoundNameOrNumber(round: number) {
        return round > this.roundNumber.swissRoundsTotal && this.roundNumber.singleElimination != 0
            ? match(round - this.roundNumber.total)
                .with(4, () => 'Finals')
                .with(3, () => 'Top 4')
                .with(2, () => 'Top 8')
                .with(1, () => 'Top 16')
                .with(0, () => 'Top 32')
                .otherwise(() => round)
            : round
    }

    protected abstract getRoundNumberData(): RoundNumber

    abstract isThereDay2(): boolean

    abstract isPlayerInDay2(points: number): boolean
}