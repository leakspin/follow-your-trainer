'use client'

import Client, { User } from "@/utils/backend/client";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./context/user/UserContext";

export default function AuthButton() {
    const { user, updateState, updateLoading } = useContext(UserContext)
    const backend = new Client({})
    const [reset, setReset] = useState<boolean>(false)

    useEffect(() => {
        const getUser = async () => {
            updateLoading(true)
            const user = await backend.getAuthUser()
            if (user) {
                await backend.getCSRFToken()
                const favsData = await backend.getFavs()
                const favs = favsData.map((fav) => fav.player_id)
                updateState({ user: user, favs: favs })
            } else {
                updateState({ user: null, favs: null })
            }
            updateLoading(false)
        }

        getUser()
    }, [reset])

    return user ? (
        <button className="button" onClick={async () => {
            await backend.logout()
            setReset(!reset)
        }}>Logout</button>
        ) : (
        <Link href={backend.getLoginUrl()} prefetch={false} className="button is-light">Login</Link>
    );
}
