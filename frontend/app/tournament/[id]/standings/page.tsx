'use client'

import TournamentHeader from "@/components/tournaments/header/TournamentHeader";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import styles from './styles.module.scss'
import TournamentStandings from "@/components/tournaments/standings/TournamentStandings";
import Client, { Tournament } from "@/utils/backend/client";

export default function Page({ params }: { params: { id: string } }) {
    const possibleDivisions = ['masters', 'seniors', 'juniors']

    const [tournament, setTournament] = useState<Tournament>()
    const [division, setDivision] = useState<string>('masters')
    const backend = new Client({})

    useEffect(() => {
        const getTournament = async () => {
            const data = await backend.getTournament(params.id)

            if ('errors' in data || !data) {
                notFound()
            } else {
                setTournament(data)
            }
        }

        getTournament()
    }, [])

    return (
        <div>
            {tournament && division && (
                <>
                    <TournamentHeader
                        tournament={tournament}
                        showStandingsButton={false}
                        showWinners={true}
                        showLinks={true}
                    />
                    <div className="tabs is-toggle is-fullwidth">
                        <ul>
                            {possibleDivisions.map((possibleDivision) => (
                                <li key={possibleDivision} className={ styles.division + ' ' + (possibleDivision == division ? 'is-active' : '')}>
                                    <a onClick={() => { setDivision(possibleDivision) }}>
                                        <span>{possibleDivision}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <TournamentStandings tournament={tournament} division={division} />
                </>
            )}
        </div>
    )
}