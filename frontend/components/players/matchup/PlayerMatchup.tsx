import { useEffect, useState } from "react"
import { P, match } from "ts-pattern"

import { IModal } from "@/types/modal"
import Client, { PlayerRound, Tournament, PlayerTournamentWithPlayer } from "@/utils/backend/client"
import PlayerRow from "../row/PlayerRow"
import { getPlayerNameWithIcons } from "@/utils/helpers"
import Link from "next/link"
import {Factory} from "@/utils/structure/Factory";

export interface PlayerMatchupProps extends IModal {
    player: PlayerTournamentWithPlayer,
    tournament: Tournament
}

type PlayerRoundExtended =
    PlayerRound & {
        player1: PlayerTournamentWithPlayer
        player2: PlayerTournamentWithPlayer
    }


export default function PlayerMatchup({ player, tournament, visible, onClose }: PlayerMatchupProps) {
    const [matchups, setMatchups] = useState<PlayerRoundExtended[]>([])
    const backend = new Client({})

    const tournamentPlayers = match(player.division)
        .with('seniors', () => tournament.seniors_players)
        .with('juniors', () => tournament.juniors_players)
        .otherwise(() => tournament.masters_players)

    const tournamentStructure = Factory.getStructure(tournament.structure, tournamentPlayers)

    useEffect(() => {
        const getPlayerRounds = async () => {
            const data = await backend.getPlayerRounds({ player1_id: player.id.toString(), order: '-round' }) as PlayerRoundExtended[]

            if ('errors' in data) {
                console.error(data)
            } else {
                setMatchups(data)
            }
        }

        getPlayerRounds()
    }, [player, visible])

    function closeModal() {
        onClose?.()
    }

    return (
        <div className={"modal " + (visible ? 'is-active' : '')}>
            <div className="modal-background" onClick={closeModal}></div>
            <div className="modal-content">
                <div className="container has-text-centered">
                    <div className="card">
                        <div className="card-content">
                            <div className="content">
                                <div>
                                    <div className="title">
                                        <Link href={'/player/'+player.player.id} onClick={closeModal}>
                                            {getPlayerNameWithIcons(player)}
                                        </Link>
                                    </div>
                                    <div className="subtitle">
                                        {player.wins}/{player.losses}/{player.ties} {player.points}pts
                                    </div>
                                </div>
                                <div className="table-container">
                                    <table className="table is-fullwidth is-striped is-hoverable is-clipped">
                                        <thead>
                                            <tr>
                                                <th>Round</th>
                                                <th>Name</th>
                                                <th>W/L/T</th>
                                                <th>Points</th>
                                                <th>Result</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {matchups.map((matchup) => (
                                                <PlayerRow
                                                    key={matchup.id}
                                                    player={matchup.player2}
                                                    playerRound={matchup}
                                                    structure={tournamentStructure}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={closeModal}>X</button>
        </div>
    )
}