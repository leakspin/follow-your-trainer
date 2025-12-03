'use client'

import { UserContext } from "@/components/context/user/UserContext";
import { useModal } from "@/hooks/useModal";
import Client, { Player } from "@/utils/backend/client";
import { mdiStar, mdiStarOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useContext, useEffect, useState } from "react";

type PlayerFavProps = {
    player: Player
}

export default function PlayerFav({player}: PlayerFavProps) {
    const backend = new Client({})
    const { user, favs, updateState } = useContext(UserContext)
    const [faved, setFaved] = useState<boolean>(false)
    const { openInfoModal } = useModal()

    useEffect(() => {
        if (user && player) {
            setFaved(favs!.indexOf(player.id) != -1)
        }
    }, [player])

    async function toggleFav() {
        if (!user) {
            openInfoModal({
                message: (
                    <div className="card">
                        <div className="card-content">
                            <div className="content">
                                Please, log in or register to save your favourite players!
                            </div>
                        </div>
                    </div>
                )
            })
            return
        }

        let data;
        if (faved) {
            data = await backend.removeFav(player.id)
        } else {
            data = await backend.addFav(player.id)
        }

        if ('errors' in data) {
            console.error(data)
        } else {
            if (faved) {
                updateState({ favs: favs!.filter((fav) => fav !== player.id) })
            } else {
                let newFavs = favs!
                newFavs.push(player.id)
                updateState({ favs: newFavs })
            }
            setFaved(!faved)
        }
    }

    return (
        <div className="pointer" onClick={toggleFav}>
            <Icon
                path={faved ? mdiStar : mdiStarOutline}
                size={'1.2em'}
            />
        </div>
    )
}