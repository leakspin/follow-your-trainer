import {RoundNumber, Structure} from "@/utils/structure/Structure";

export default class DefaultStructure extends Structure {
    getRoundNameOrNumber(round: number): string | number {
        return round;
    }

    isThereDay2(): boolean {
        return false;
    }

    isPlayerInDay2(points: number): boolean {
        return false;
    }

    protected getRoundNumberData(): RoundNumber {
        return new RoundNumber(9999,0,0);
    }
}