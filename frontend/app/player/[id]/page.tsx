'use client'

import PlayerFav from "@/components/players/fav/PlayerFav"
import TournamentHeader from "@/components/tournaments/header/TournamentHeader"
import Client, { PlayerWithTournaments } from "@/utils/backend/client"
import { getPlayerNameWithCountry } from "@/utils/helpers"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import styles from './styles.module.scss'

export default function Page({ params }: { params: { id: string } }) {
    const [player, setPlayer] = useState<PlayerWithTournaments>()
    const backend = new Client({})

    useEffect(() => {
        const getPlayer = async () => {
            const data = await backend.getPlayerWithTournaments(params.id)

            if ('errors' in data || !data) {
                notFound()
            } else {
                setPlayer(data)
            }
        }

        getPlayer()
    }, [])

    return (
        <div className="container has-text-centered">
            {player && (
                <>
                    <div className={"title " + styles.title}>
                        <PlayerFav player={player} />
                        <div>{getPlayerNameWithCountry(player)}</div>
                    </div>
                    {player.playertournaments
                        .sort((a, b) => +new Date(b.tournament.start_date) - +new Date(a.tournament.start_date))
                        .map((playertournament) => (
                            <TournamentHeader
                                key={playertournament.tournament.id}
                                tournament={playertournament.tournament}
                                playerProfile={playertournament}
                                showStandingsButton={false}
                                showWinners={false}
                                showLinks={false}
                            />
                    ))}
                </>
            )}
        </div>
    )
}