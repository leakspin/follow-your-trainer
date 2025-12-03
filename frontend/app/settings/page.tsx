'use client'

import { UserContext } from "@/components/context/user/UserContext"
import PlayerSearch from "@/components/players/search/PlayerSearch"
import { useModal } from "@/hooks/useModal"
import Client from "@/utils/backend/client"
import { getPlayerNameWithCountry } from "@/utils/helpers"
import { redirect } from "next/navigation"
import { useContext, useEffect, useState } from "react"

type FormData = {
    name: string
    player_id: string
}

export default function Page() {
    const backend = new Client({})
    const { user, updateState, loading } = useContext(UserContext)
    const { openInfoModal } = useModal()
    const [formData, setFormData] = useState<FormData>({name: '', player_id: ''})
    const [saved, setSaved] = useState<boolean|null>(null)

    useEffect(() => {
        if (!loading && !user) {
            redirect('/')
        }

        if (user) {
            setFormData({name: user.name, player_id: user.player_id.toString()})
        }
    }, [user, loading])

    async function saveInfo() {
        const newUserData = await backend.updateUserSettings(formData)

        if ('errors' in newUserData) {
            console.error(newUserData)
            setSaved(false)
        } else {
            updateState({ user: newUserData })
            setSaved(true)
        }
    }

    const playerInfoMessage = (
        <div className="card">
            <div className="card-content">
                <div className="content">
                    Here you can search for your player entry in our database and assign it to you. Please, take into account that, if you didn't participate in any international tournament registered in this application, you won't be able to associate your player profile with yourself.
                </div>
            </div>
        </div>
    )

    const savedMessage = (
        <article className={"message " + (saved ? 'is-success' : 'is-error')}>
            <div className="message-body">
                {saved ? 'Settings saved successfully' : 'There was a problem saving your settings. Please, try again later or contact the administrator.'}
            </div>
        </article>
    )

    return (
        <div>
            {user && (
                <>
                    {saved != null && savedMessage}
                    <div className="field">
                        <label className="label">Name</label>
                        <div className="control">
                            <input type="text" className="input" placeholder="Name" id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.currentTarget.value})} />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Who are you?
                            <span className="icon has-text-warning pointer  " onClick={() => { openInfoModal({ message: playerInfoMessage }) }}>
                                ⚠️
                            </span>
                        </label>
                        <div className="control">
                            <PlayerSearch
                                onClick={(e) => {
                                    setFormData({...formData, player_id: e.currentTarget.dataset.playerId!})
                                }}
                                setNameOnClick={true}
                                clearPlayersOnClick={true}
                                defaultValue={formData.player_id ? getPlayerNameWithCountry(user.player!) : ''}
                            />
                            <input type="text" name="player_id" id="player_id" value={formData.player_id} hidden />
                        </div>
                    </div>
                    <div className="field">
                        <div className="control">
                            <button className="button is-link" onClick={saveInfo}>Submit</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}