'use client'

import InfoModal, { InfoModalProps } from '@/components/InfoModal';
import PlayerMatchup, { PlayerMatchupProps } from '@/components/players/matchup/PlayerMatchup';
import PlayerSearchModal from '@/components/players/search/PlayerSearchModal';
import { IModal, OpenModal } from '@/types/modal';
import { ReactNode, createContext, useCallback, useContext, useState } from 'react';

interface IModalContext {
    openPlayerMatchup: OpenModal<PlayerMatchupProps>,
    openInfoModal: OpenModal<InfoModalProps>,
    openPlayerSearchModal: OpenModal<IModal>,
    visible: boolean
}

const ModalContext = createContext<IModalContext>({} as IModalContext);

const useDefaultModalLogic = <T extends unknown>() => {
    const [visible, setVisible] = useState(false);
    const [props, setProps] = useState<T | undefined>();

    const openModal = useCallback((props?: T) => {
        setProps(props);
        setVisible(true);
        document.documentElement.classList.add('modal-open');
    }, []);

    const closeModal = useCallback(() => {
        setProps(undefined);
        setVisible(false);
        document.documentElement.classList.remove('modal-open');
    }, []);

    return {
        visible,
        props,
        openModal,
        closeModal,
    };
};

export const useModal = () => useContext(ModalContext);

export const ModalContextProvider = ({
    children,
}: {
    children?: ReactNode,
}) => {
    const {
        openModal: openPlayerMatchup,
        closeModal: closePlayerMatchup,
        props: playerMatchupProps,
        visible: playerMatchupVisible,
    } = useDefaultModalLogic<PlayerMatchupProps>();

    const {
        openModal: openInfoModal,
        closeModal: closeInfoModal,
        props: infoModalProps,
        visible: infoModalVisible,
    } = useDefaultModalLogic<InfoModalProps>();

    const {
        openModal: openPlayerSearchModal,
        closeModal: closePlayerSearchModal,
        props: playerSearchModalProps,
        visible: playerSearchModalVisible,
    } = useDefaultModalLogic<IModal>();

    const modalContextValue: IModalContext = {
        openPlayerMatchup,
        openInfoModal,
        openPlayerSearchModal,
        visible: playerMatchupVisible
    };

    return (
        <ModalContext.Provider value={modalContextValue}>
            {playerMatchupProps && (
                <PlayerMatchup {...playerMatchupProps} onClose={closePlayerMatchup} visible={playerMatchupVisible} />
            )}
            {infoModalProps && (
                <InfoModal {...infoModalProps} onClose={closeInfoModal} visible={infoModalVisible} />
            )}
            {playerSearchModalProps && (
                <PlayerSearchModal {...playerSearchModalProps} onClose={closePlayerSearchModal} visible={playerSearchModalVisible} />
            )}
            {children}
        </ModalContext.Provider>
    );
};