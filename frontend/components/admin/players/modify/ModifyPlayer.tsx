'use client'

import PlayerSearch from "@/components/players/search/PlayerSearch";
import Client from "@/utils/backend/client";
import { MouseEventHandler, useEffect, useState } from "react";

type FormData = {
    name: string
    country: string
    player_id: string
}

export default function ModifyPlayer() {
    const backend = new Client({})
    const [saved, setSaved] = useState<boolean|null>(null)
    const [error, setError] = useState<string>('')
    const [formData, setFormData] = useState<FormData>({name: '', country: '', player_id: ''})
    const [playerId, setPlayerId] = useState<string>('')
    const [reset, setReset] = useState<boolean>()

    useEffect(() => {
        const getPlayerData = async () => {
            if (playerId) {
                const playerData = await backend.getPlayer(playerId)

                if ('errors' in playerData) {
                    console.error(playerData)
                } else {
                    setFormData({name: playerData.name, country: playerData.country, player_id: playerId})
                }
            }
        }

        getPlayerData()
    }, [playerId])

    useEffect(() => {
        if (typeof reset != 'undefined') {
            setFormData({name: '', country: '', player_id: ''})
            setSaved(true)
        }
    }, [reset])

    async function saveInfo() {
        const modifyPlayerData = await backend.modifyPlayer(formData)

        if ('errors' in modifyPlayerData) {
            console.error(modifyPlayerData)
            setSaved(false)
            setError(JSON.stringify(modifyPlayerData.errors))
        } else {
            setReset(!reset)
            setError('')
        }
    }

    const savedMessage = (
        <article className={"message " + (saved ? 'is-success' : 'is-error')}>
            <div className="message-body">
                {saved ? 'Player info modified successfully' : 'There was a problem updating player. Here is the error below:'}
                {error && (
                    <pre>{error}</pre>
                )}
            </div>
        </article>
    )

    return (
        <>
            <form id='modifyPlayer'>
                {saved != null && savedMessage}
                <div className="field">
                    <label className="label">Player to modify</label>
                    <div className="control">
                        <PlayerSearch
                            onClick={(e) => {
                                setPlayerId(e.currentTarget.dataset.playerId!)
                            }}
                            setNameOnClick={true}
                            clearPlayersOnClick={true}
                            reset={reset}
                        />
                        <input type="number" name="player_id" value={playerId} hidden readOnly />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Name</label>
                    <div className="control">
                        <input className="input" type="string" name="name" value={formData.name ?? ''} onChange={(e) => setFormData({...formData, name: e.currentTarget.value})} />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Country</label>
                    <div className="control">
                        <input className="input" type="string" name="country" value={formData.country ?? ''} onChange={(e) => setFormData({...formData, country: e.currentTarget.value})}  />
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <button className="button is-link" onClick={saveInfo}>Submit</button>
                    </div>
                </div>
            </form>
        </>
    )
}