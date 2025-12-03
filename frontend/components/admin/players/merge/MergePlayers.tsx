'use client'

import PlayerSearch from "@/components/players/search/PlayerSearch";
import Client from "@/utils/backend/client";
import { MouseEventHandler, useEffect, useState } from "react";

type FormData = {
    player_to_stay_id: string
    player_to_fuse_id: string
}

export default function MergePlayers() {
    const backend = new Client({})
    const [saved, setSaved] = useState<boolean|null>(null)
    const [error, setError] = useState<string>('')
    const [formData, setFormData] = useState<FormData>({player_to_stay_id: '', player_to_fuse_id: ''})
    const [reset, setReset] = useState<boolean>()

    useEffect(() => {
        if (typeof reset != 'undefined') {
            setFormData({player_to_stay_id: '', player_to_fuse_id: ''})
            setSaved(true)
        }
    }, [reset])

    async function saveInfo() {
        if (formData.player_to_fuse_id === formData.player_to_stay_id) {
            setSaved(false)
            setError('IDs must not be equal between stay ('+formData.player_to_stay_id+') and fuse ('+formData.player_to_fuse_id+')')
        }

        const mergePlayersData = await backend.mergePlayers(formData)

        if ('errors' in mergePlayersData) {
            console.error(mergePlayersData)
            setSaved(false)
            setError(JSON.stringify(mergePlayersData.errors))
        } else {
            setReset(!reset)
            setError('')
        }
    }

    const savedMessage = (
        <article className={"message " + (saved ? 'is-success' : 'is-error')}>
            <div className="message-body">
                {saved ? 'Players merged successfully' : 'There was a problem merging players. Here is the error below:'}
                {error && (
                    <pre>{error}</pre>
                )}
            </div>
        </article>
    )

    return (
        <>
                {saved != null && savedMessage}
                <div className="field">
                    <label className="label">Player to stay</label>
                    <div className="control">
                        <PlayerSearch
                            onClick={(e) => {
                                setFormData({...formData, player_to_stay_id: e.currentTarget.dataset.playerId!})
                            }}
                            setNameOnClick={true}
                            clearPlayersOnClick={true}
                            reset={reset}
                        />
                        <input type="number" name="player_to_stay_id" value={formData.player_to_stay_id ?? ''} hidden readOnly />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Player to fuse</label>
                    <div className="control">
                        <PlayerSearch
                            onClick={(e) => {
                                setFormData({...formData, player_to_fuse_id: e.currentTarget.dataset.playerId!})
                            }}
                            setNameOnClick={true}
                            clearPlayersOnClick={true}
                            reset={reset}
                        />
                        <input type="number" name="player_to_fuse_id" value={formData.player_to_fuse_id ?? ''} hidden readOnly />
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <button className="button is-link" onClick={saveInfo}>Submit</button>
                    </div>
                </div>
        </>
    )
}