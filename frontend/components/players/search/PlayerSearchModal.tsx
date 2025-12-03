import { IModal } from "@/types/modal"
import { ReactNode } from "react"
import PlayerSearch from "./PlayerSearch"
import { useRouter } from "next/navigation"

export interface InfoModalProps extends IModal {
    message: ReactNode
}

export default function PlayerSearchModal({visible, onClose}: IModal) {
    const router = useRouter()
    function closeModal() {
        onClose?.()
    }

    return (
        <div className={"modal " + (visible ? 'is-active' : '') }>
            <div className="modal-background" onClick={closeModal}></div>
            <div className="modal-content">
                <div className="container has-text-centered">
                    <PlayerSearch
                        onClick={(e) => {
                            router.push('/player/' + e.currentTarget.dataset.playerId)
                            closeModal()
                        }}
                        clearPlayersOnClick={false}
                        setNameOnClick={false}
                        focus={true}
                    />
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={closeModal}>X</button>
        </div>
    )
}