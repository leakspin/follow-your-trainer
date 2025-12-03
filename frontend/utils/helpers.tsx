'use client'

import { ReactNode, useContext } from "react";
import Client, { PlayerTournamentWithPlayer, Player } from "./backend/client";
import { UserContext } from "@/components/context/user/UserContext";
import { useModal } from "@/hooks/useModal";

export function getFlagEmoji(countryCode: string) {
    if (countryCode == 'UK') {
        countryCode = 'GB'
    }

    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

export function getPlayerNameWithIcons(player: PlayerTournamentWithPlayer) {
    let row = ''

    if (player.placing == 9999) {
        row = '🚫 '
    } else if (player.drop > -1) {
        row = '🏃 '
    }

    if (player['player']) {
        row += getPlayerNameWithCountry(player.player)
    } else {
        row += player.name
    }

    return row
}

export function getPlayerNameWithCountry(player: Player) {
    return player.country ? getFlagEmoji(player.country) + ' ' + player.name : player.name
}