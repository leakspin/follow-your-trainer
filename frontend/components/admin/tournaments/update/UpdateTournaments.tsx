'use client'

import Client, {Tournament} from "@/utils/backend/client";
import {useEffect, useState} from "react";

type ModifiedTournamentData = {
    name?: string;
    structure?: string;
    autoupdate?: number;
}

export default function UpdateTournaments() {
    const backend = new Client({})
    const [saved, setSaved] = useState<boolean|null>(null)
    const [savedName, setSavedName] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [tournaments, setTournaments] = useState<Tournament[]>([])
    const [structures, setStructures] = useState<string[]>([])
    const [modifiedTournaments, setModifiedTournaments] = useState<Tournament[]>([])

    useEffect(() => {
        const getData = async () => {
            const structureData = await backend.getTournamentStructures()

            if ("errors" in structureData) {
                console.error(structureData)
            } else {
                setStructures(structureData);
                console.log(structureData)
            }

            const tournamentData = await backend.getAdminTournaments()

            if ("errors" in tournamentData) {
                console.error(tournamentData)
            } else {
                setTournaments(tournamentData);
            }
        }

        getData()
    }, [])

    function addModifiedTournament(id: number, options: ModifiedTournamentData){
        if (typeof modifiedTournaments[id] == 'undefined') {
            modifiedTournaments[id] = tournaments.find(e => e.id === id)!
        }

        modifiedTournaments[id].name = options.name ?? modifiedTournaments[id].name
        modifiedTournaments[id].structure = options.structure ?? modifiedTournaments[id].structure
        modifiedTournaments[id].autoupdate = options.autoupdate ?? modifiedTournaments[id].autoupdate
    }

    async function saveTournament(id: number) {
        if (typeof modifiedTournaments[id] == 'undefined') {
            return
        }

        setSavedName(modifiedTournaments[id].name)
        const saveData = await backend.updateTournament(id.toString(), {
            name: modifiedTournaments[id].name,
            structure: modifiedTournaments[id].structure,
            autoupdate: modifiedTournaments[id].autoupdate,
        })

        if ("errors" in saveData) {
            console.error(saveData)
            setSaved(false)
            setError(JSON.stringify(saveData.errors))
        } else {
            console.log(saveData);
            setSaved(true)
            setError('')
        }
    }

    const savedMessage = (
        <article className={"message " + (saved ? 'is-success' : 'is-error')}>
            <div className="message-body">
                {saved ? '"'+savedName+'" modified successfully' : 'There was a problem updating "'+savedName+'". Here is the error below:'}
                {error && (
                    <pre>{error}</pre>
                )}
            </div>
        </article>
    )

    return (
        <>
            {saved != null && savedMessage}
            <table className='table is-fullwidth'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Autoupdate</th>
                        <th>Structure</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {tournaments && tournaments.map((tournament) => (
                    <tr key={tournament.id}>
                        <td>
                            <input className="input" type="text" defaultValue={tournament.name} onChange={(e) => addModifiedTournament(tournament.id, {name: e.target.value})} />
                        </td>
                        <td>
                            {tournament.status}
                        </td>
                        <td>
                            <div className='select'>
                                <select defaultValue={tournament.autoupdate} onChange={(e) => addModifiedTournament(tournament.id, {autoupdate: parseInt(e.target.value)})}>
                                    <option value="0">No</option>
                                    <option value="1">Yes</option>
                                </select>
                            </div>
                        </td>
                        <td>
                            <div className='select'>
                                <select defaultValue={tournament.structure} onChange={(e) => addModifiedTournament(tournament.id, {structure: e.target.value})}>
                                    {structures && structures.map((structure) => (
                                        <option key={structure} value={structure} >{structure}</option>
                                    ))}
                                </select>
                            </div>
                        </td>
                        <td>
                            <button className='button is-primary' onClick={(e) => saveTournament(tournament.id)}>Save</button>
                        </td>
                    </tr>
                ))}

                </tbody>
            </table>
        </>
    )
}