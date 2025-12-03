'use client'

import MergePlayers from "@/components/admin/players/merge/MergePlayers";
import styles from './styles.module.scss'
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/components/context/user/UserContext";
import { redirect } from "next/navigation";
import ModifyPlayer from "@/components/admin/players/modify/ModifyPlayer";
import UpdateTournaments from "@/components/admin/tournaments/update/UpdateTournaments";

export default function Page() {
    const [tab, setTab] = useState<string>('merge')
    const {user, loading} = useContext(UserContext)

    useEffect(() => {
        if (!loading && (!user || !user.permissions.admin)) {
            redirect('/')
        }
    }, [user])

    return (
        <div>
            <div className="tabs is-centered">
                <ul>
                    <li className={tab === 'merge' ? 'is-active' : ''}><a onClick={() => setTab('merge')}>Merge Players</a></li>
                    <li className={tab === 'modify' ? 'is-active' : ''}><a onClick={() => setTab('modify')}>Modify Player</a></li>
                    <li className={tab === 'tournament' ? 'is-active' : ''}><a onClick={() => setTab('tournament')}>Update Tournaments</a></li>
                </ul>
            </div>
            <div className={"container " + styles.tabContainer}>
                <div className={tab === 'merge' ? styles.visible : ''}><MergePlayers /></div>
                <div className={tab === 'modify' ? styles.visible : ''}><ModifyPlayer /></div>
                <div className={tab === 'tournament' ? styles.visible : ''}><UpdateTournaments /></div>
            </div>
        </div>
    )
}