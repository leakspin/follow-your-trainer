import styles from './styles.module.scss'

import { match } from 'ts-pattern'
import { ReactNode, useEffect, useState } from 'react'
import Client, { Player, PlayerTournamentWithPlayer, Tournament } from '@/utils/backend/client'
import Link from 'next/link'
import { useModal } from '@/hooks/useModal'

type TournamentHeaderProps = {
    tournament: Tournament,
    showLinks?: boolean,
    showWinners?: boolean,
    showStandingsButton?: boolean,
    playerProfile?: PlayerTournamentWithPlayer|null
}

export default function TournamentHeader({
    tournament,
    showLinks = false,
    showWinners = true,
    showStandingsButton = false,
    playerProfile = null,
}: TournamentHeaderProps) {
    const [mastersWinner, setMastersWinner] = useState<PlayerTournamentWithPlayer>()
    const [juniorsWinner, setJuniorsWinner] = useState<PlayerTournamentWithPlayer>()
    const [seniorsWinner, setSeniorsWinner] = useState<PlayerTournamentWithPlayer>()
    const { openPlayerMatchup } = useModal()
    const backend = new Client({})

    if (tournament.status == 'finished') {
        useEffect(() => {
            const getWinners = async () => {
                const data = await backend.getPlayersFromTournament({tournament_id: tournament.id.toString(), placing: '1'})
    
                if ('errors' in data) {
                    console.error(data)
                } else {
                    data.forEach((winner) => {
                        match(winner.division)
                            .with('masters', () => setMastersWinner(winner))
                            .with('seniors', () => setSeniorsWinner(winner))
                            .with('juniors', () => setJuniorsWinner(winner))
                            .otherwise(() => { })
                    })
                }
            }
    
            getWinners()
        }, [])
    }

    const tournamentStartDate = tournament.start_date.split('T')[0]

    const tournamentStatusBadge = match(tournament.status)
        .returnType<string>()
        .with('running', () => 'is-success')
        .otherwise(() => 'is-black')

    return (
        <div className={'card ' + styles.tournamentSummary }>
            <div className="card-content">
                <div className={styles.header}>
                    <p className="title">{tournament.name}</p>
                    <span className={'tag is-large is-uppercase ' + tournamentStatusBadge}>{tournament.status}</span>
                </div>
                { playerProfile && (
                        <div>
                            <p className='subtitle has-text-left'>Position: {playerProfile.placing} - {playerProfile.wins}/{playerProfile.losses}/{playerProfile.ties} {playerProfile.points}pts</p>
                        </div>
                )}
                <div className={styles.tournamentInfo}>
                    <p>Start Date: {tournamentStartDate}</p>
                    { showLinks && (
                        <>
                            <Link href={'https://rk9.gg/pairings/' + tournament.rk9link} target='blank'>
                                <img src="/images/rk9.jpg" alt="RK9 Pairings" />
                            </Link>
                            <Link href={'https://pokedata.ovh/standings/' + tournament.pokedata_id} target='blank'>
                                <img src="/images/pokedata.png" alt="Pokedata Standings" />
                            </Link>
                        </>
                    ) }
                </div>
            </div>
            { showWinners &&
                <footer className={"card-footer " + styles.winners}>
                    {mastersWinner && <p className={"card-footer-item " + styles.winner }><span>👑 Masters: {mastersWinner.player.name}</span></p>}
                    {seniorsWinner && <p className={"card-footer-item " + styles.winner }><span>👑 Seniors: {seniorsWinner.player.name}</span></p>}
                    {juniorsWinner && <p className={"card-footer-item " + styles.winner }><span>👑 Juniors: {juniorsWinner.player.name}</span></p>}
                </footer>
            }
            { showStandingsButton &&
                <footer className="card-footer">
                    <Link href={ '/tournament/' + tournament.id + '/standings' } className="card-footer-item">Standings</Link>
                </footer>
            }
            { playerProfile &&
                <footer className="card-footer">
                    <Link className="card-footer-item" href={'/tournament/' + tournament.id + '/standings'}>Standings</Link>
                    <button className="card-footer-item" onClick={() => { openPlayerMatchup({ player: playerProfile, tournament: tournament }) }}>Matchups</button>
                </footer>
            }
        </div>
    )
}