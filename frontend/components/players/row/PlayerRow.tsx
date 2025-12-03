import { PlayerRound, PlayerTournamentWithPlayer } from '@/utils/backend/client'
import { match } from 'ts-pattern'
import { getPlayerNameWithIcons } from '@/utils/helpers'
import styles from './styles.module.scss'
import PlayerFav from '../fav/PlayerFav'
import {Structure} from "@/utils/structure/Structure";

type PlayerRowProps = {
    player: PlayerTournamentWithPlayer,
    playerRound?: PlayerRound,
    structure: Structure,
    onClick?: () => void,
}

export default function PlayerRow({ player, playerRound, onClick, structure }: PlayerRowProps) {
    function getRowColorByResult(result: string) {
        return match(result)
            .with('W', () => 'is-success')
            .with('T', () => 'is-warning')
            .with('L', () => 'is-danger')
            .otherwise(() => '')
    }

    let id = playerRound ? 'player-round-' + playerRound.id : 'player-' + player.id

    let rowClassName = 'has-text-centered-mobile '
    let cellClassName = ' '

    if (structure.isPlayerInDay2(player.points)) {
        rowClassName += 'has-text-weight-bold '
    }

    if (playerRound) {
        rowClassName += getRowColorByResult(playerRound.result) + ' '
    }

    if (onClick) {
        cellClassName += 'pointer '
    }

    return (
        <tr key={id} className={rowClassName}>
            {!playerRound && (
                <td className={styles.smallestCell}>
                    <PlayerFav player={player.player} />
                </td>
            )}
            <td onClick={onClick} className={cellClassName + styles.smallestCell + ' has-text-centered'}>
                {playerRound && (
                    structure.getRoundNameOrNumber(playerRound.round)
                )}
                {!playerRound && (
                    player.placing
                )}
            </td>
            <td onClick={onClick} className={cellClassName}>
                {getPlayerNameWithIcons(player)}
            </td>
            <td onClick={onClick} className={cellClassName + styles.smallestCell + ' ' + styles.noWrap + ' has-text-centered'}>
                {player.wins}/{player.losses}/{player.ties}
            </td>
            <td onClick={onClick} className={cellClassName + styles.smallestCell + ' has-text-centered'}>
                {player.points}
            </td>
            {playerRound && (
                <td onClick={onClick} className={cellClassName + styles.smallestCell + ' has-text-centered'}>
                    {playerRound.result}
                </td>
            )}
        </tr>
    )
}