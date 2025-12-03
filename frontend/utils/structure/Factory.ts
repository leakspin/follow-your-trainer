import Reg2024Structure from "@/utils/structure/Reg2024Structure";
import DefaultStructure from "@/utils/structure/DefaultStructure";
import {Structure} from "@/utils/structure/Structure";
import Worlds2024Structure from "@/utils/structure/Worlds2024Structure";
import CupStructure from "@/utils/structure/CupStructure";
import ChallengeStructure from "@/utils/structure/ChallengeStructure";
import Reg202520241117Structure from "./Reg202520241117Structure";
import Reg2025Structure from "./Reg2025Structure";

export class Factory {
    static STRUCTURES = {
        reg2024: Reg2024Structure,
        worlds2024: Worlds2024Structure,
        cup: CupStructure,
        challenge: ChallengeStructure,
        reg2025: Reg2025Structure,
        "reg2025-20241117": Reg202520241117Structure,
    }

    public static getStructure(structure: string, tournamentPlayers: number): Structure {
        if (Object.keys(Factory.STRUCTURES).find((possibleStructure) => possibleStructure === structure)) {
            // @ts-ignores
            return new Factory.STRUCTURES[structure](tournamentPlayers)
        }

        return new DefaultStructure(tournamentPlayers)
    }
}