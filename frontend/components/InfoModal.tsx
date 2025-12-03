import { IModal } from "@/types/modal"
import { ReactNode } from "react"

export interface InfoModalProps extends IModal {
    message: ReactNode
}

export default function InfoModal({message, visible, onClose}: InfoModalProps) {
    function closeModal() {
        onClose?.()
    }

    return (
        <div className={"modal " + (visible ? 'is-active' : '') }>
            <div className="modal-background" onClick={closeModal}></div>
            <div className="modal-content">
                <div className="container has-text-centered">
                    {message}
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={closeModal}>X</button>
        </div>
    )
}