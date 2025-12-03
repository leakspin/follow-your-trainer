import {RoundNumber, Structure} from "@/utils/structure/Structure";
import {match, P} from "ts-pattern";
import CupStructure from "@/utils/structure/CupStructure";

export default class ChallengeStructure extends CupStructure {
    protected getRoundNumberData(): RoundNumber {
        return this.getRoundNumberDataCupOrChallenge(true)
    }
}