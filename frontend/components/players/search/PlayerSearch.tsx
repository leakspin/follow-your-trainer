'use client'

import Client, { Player } from "@/utils/backend/client"
import { getPlayerNameWithCountry } from "@/utils/helpers"
import { useEffect, useState } from "react"
import styles from './styles.module.scss'

type PlayerSearchProps = {
    onClick?: (e: React.MouseEvent<HTMLElement>) => void
    setNameOnClick: boolean
    clearPlayersOnClick: boolean
    defaultValue?: string
    focus?: boolean
    reset?: boolean
}

export default function PlayerSearch({ onClick, setNameOnClick, clearPlayersOnClick, defaultValue, focus = false, reset }: PlayerSearchProps) {
    const backend = new Client({})
    const [name, setName] = useState<string>()
    const [input, setInput] = useState<string>('')
    const [players, setPlayers] = useState<Player[]>([])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const searchName = async () => {
                if (name) {
                    const data = await backend.searchPlayers({ name: name })

                    if ('errors' in data) {
                        console.error(data)
                    } else {
                        setPlayers(data)
                    }
                }
            }

            searchName()
        }, 750)

        return () => clearTimeout(timeoutId)
    }, [name])

    useEffect(() => {
        setInput(defaultValue ?? '')
    }, [defaultValue])

    useEffect(() => {
        setInput('')
    }, [reset])

    return (
        <div>
            <input className="input" type="text" placeholder="Search for a trainer..." onChange={(e) => {
                setInput(e.target.value)
                setName(e.target.value)
            }} autoFocus={focus} value={input} />
            {players && players.length > 0 && (
                <div className={"card " + styles.results}>
                    {players.map((player) => (
                        <footer key={player.id} className="card-footer">
                            <div onClick={onClick ? (e) => {
                                if (setNameOnClick) {
                                    setInput(getPlayerNameWithCountry(player))
                                }
                                onClick(e)
                                if (clearPlayersOnClick) {
                                    setPlayers([])
                                }
                            } : () => { }} className={'card-footer-item ' + (onClick ? 'pointer' : '')} data-player-id={player.id}>
                                {getPlayerNameWithCountry(player)}
                            </div>
                        </footer>
                    ))}
                </div>
            )}
        </div>
    )
}   