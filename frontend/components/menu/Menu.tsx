'use client'

import { MouseEvent, useContext } from "react";
import AuthButton from "../AuthButton";
import { UserContext } from "../context/user/UserContext";
import Link from "next/link";
import styles from './styles.module.scss'
import PlayerSearch from "../players/search/PlayerSearch";
import { useModal } from "@/hooks/useModal";
import { useRouter } from "next/navigation";

export default function Menu() {
    const { user } = useContext(UserContext)
    const router = useRouter()
    const { openPlayerSearchModal, openInfoModal } = useModal()

    function toggleMenuOpen(event: MouseEvent<HTMLElement>) {
        const target = event.currentTarget.dataset.target!;
        const $target = document.getElementById(target)!;

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        event.currentTarget.classList.toggle('is-active');
        $target.classList.toggle('is-active');
    }

    const searchModal = (
        <div>
            <PlayerSearch
                onClick={(e) => {
                    router.push('/player/' + e.currentTarget.dataset.playerId)
                }}
                clearPlayersOnClick={false}
                setNameOnClick={false}
            />
        </div>
    )

    const legendModal = (
        <div className="card">
            <div className="card-content">
                <div className="content">
                    <p>Here is a legend of the different symbols that you can see in the app:</p>
                    <p><span className="has-text-weight-bold">Bolded players</span> are players qualified for Day 2</p>
                    <p>🚫: player has been DQed</p>
                    <p>🏃: player has dropped</p>
                </div>
            </div>
        </div>
    )

    return (
        <nav className={"navbar " + styles.navbar} role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <div className="navbar-item">
                    <Link href='/'><p className="title">Follow Your Trainer</p></Link>
                </div>
                <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="fyt-menu" onClick={toggleMenuOpen}>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="fyt-menu" className="navbar-menu">
                <div className="navbar-start">
                </div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                            <button className='button' onClick={() => openInfoModal({message: legendModal})}>Legend</button>
                            <button className='button' onClick={() => openPlayerSearchModal({})}>Search</button>
                            {user && (
                                <>
                                    {user.player_id != null && <Link href={'/player/' + user.player_id} className='button'>Profile</Link>}
                                    <Link href='/settings' className='button'>Settings</Link>
                                    {user.permissions.admin && <Link href='/admin' className='button is-danger'>Admin</Link>}
                                </>
                                )}
                            <AuthButton />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}