import { useContext, useEffect, useState } from "react";
import styles from './styles.module.scss'
import { useModal } from "@/hooks/useModal";
import Client, { PlayerTournamentWithPlayer, Tournament } from "@/utils/backend/client";
import { match } from "ts-pattern";
import escapeStringRegexp from "escape-string-regexp";
import PlayerRow from "@/components/players/row/PlayerRow";
import Icon from "@mdi/react";
import { mdiStarShooting } from "@mdi/js";
import { UserContext } from "@/components/context/user/UserContext";
import { Factory } from "@/utils/structure/Factory";
import { getFlagEmoji } from "@/utils/helpers";
import Collapsible from "react-collapsible";

type TournamentStandingsProps = {
    tournament: Tournament,
    division: string
}

export default function TournamentStandings({ tournament, division }: TournamentStandingsProps) {
    const [standings, setStandings] = useState<PlayerTournamentWithPlayer[]>([])
    const [filteredStandings, setFilteredStandings] = useState<PlayerTournamentWithPlayer[]>([])
    const [nameQuery, setNameQuery] = useState<string>()
    const [countryQuery, setCountryQuery] = useState<string[]>([])
    const [availableCountries, setAvailableCountries] = useState<string[]>([])
    const [updatingData, setUpdatingData] = useState<boolean>(true)
    const [showFavs, setShowFavs] = useState<boolean>(false)
    const { openPlayerMatchup } = useModal()
    const backend = new Client({})
    const { user, favs } = useContext(UserContext)

    const tournamentPlayers = match(division)
        .with('seniors', () => tournament.seniors_players)
        .with('juniors', () => tournament.juniors_players)
        .otherwise(() => tournament.masters_players)

    const tournamentStructure = Factory.getStructure(tournament.structure, tournamentPlayers)

    const getStandings = async () => {
        setUpdatingData(true)
        const data = await backend.getPlayersFromTournament({
            tournament_id: tournament.id.toString(),
            division: division,
            order: 'placing'
        })

        if ('errors' in data) {
            console.error(data)
        } else {
            setStandings(data)
            setAvailableCountries(data.map((player) => player.player.country ?? '').filter((value) => value != '').filter((value, index, array) => array.indexOf(value) === index))
        }
    }

    useEffect(() => {
        getStandings()
    }, [division])

    useEffect(() => {
        const filteredStandingsInterval = setTimeout(() => {
            let filteredStandings = standings
                .filter((elem) => elem.name.match(new RegExp('^.*' + escapeStringRegexp(nameQuery ?? '') + '.*$', 'i')))

            if (showFavs) {
                filteredStandings = filteredStandings.filter((elem) => favs?.indexOf(elem.player_id) != -1)
            }

            if (countryQuery.length > 0) {
                filteredStandings = filteredStandings.filter((elem) => countryQuery.indexOf(elem.player.country) != -1)
            }

            setFilteredStandings(filteredStandings)
            setUpdatingData(false)
        }, 700)

        return () => clearTimeout(filteredStandingsInterval)
    }, [standings, nameQuery, countryQuery, showFavs])

    function cleanSearch() {
        (document.getElementById('nameQuery') as HTMLInputElement).value = ''
        setNameQuery('')
    }

    return (
        <>
            <div className={styles.marginTopBottom + ' ' + styles.buttons}>
                {user && (
                    <button
                        className={"button " + styles.button + " " + (showFavs ? "is-link" : "")}
                        onClick={() => setShowFavs(!showFavs)}
                    >
                        <Icon path={mdiStarShooting} size='1.2em' /> Favs
                    </button>
                )}
                <button className={"button " + styles.button + " " + (updatingData ? "is-loading" : "")} onClick={getStandings}>🔃 Refresh Data</button>
            </div>
            <div className={"field " + styles.marginTopBottom}>
                <div className="control has-icons-right">
                    <input className="input" id="nameQuery" type="text" placeholder="Search a name..." onChange={(e) => setNameQuery(e.target.value)} />
                    <span className="icon is-medium is-right">
                        {nameQuery && <button className="delete is-medium" onClick={cleanSearch}></button>}
                    </span>
                </div>
            </div>
            <div className={"field " + styles.marginTopBottom}>
                <div className="control has-icons-right">
                    <Collapsible
                        trigger="Filters ⬇️"
                        triggerWhenOpen="Filters ⬆️"
                        triggerTagName="div"
                        className={styles.filters}
                        openedClassName={styles.filters}
                        triggerClassName={styles.filtersHeader}
                        triggerOpenedClassName={styles.filtersHeader}
                        contentInnerClassName={styles.filtersContent}
                    >
                        <p className={`title is-5 ${styles.title}`}>Countries</p>
                        <div className={styles.countryFilter}>
                            {availableCountries && availableCountries.map((country) => 
                                <div
                                    className={countryQuery.indexOf(country) != -1 ? styles.active : ''}
                                    onClick={() => {
                                        setCountryQuery(countryQuery.indexOf(country) != -1
                                            ? countryQuery.filter((elem) => elem != country)
                                            : [...countryQuery, country]
                                        )
                                    }}
                                >
                                    {getFlagEmoji(country)}
                                </div>
                            )}
                        </div>
                    </Collapsible>
                </div>
            </div>
            <div className="table-container">
                <table className="table is-fullwidth is-striped is-hoverable">
                    <thead>
                        <tr>
                            <th className="has-text-centered-mobile"><Icon path={mdiStarShooting} size={'1em'} /></th>
                            <th className="has-text-centered-mobile">Position</th>
                            <th className="has-text-centered-mobile">Name</th>
                            <th className={"has-text-centered-mobile " + styles.noWrap}>W/L/T</th>
                            <th className="has-text-centered-mobile">Points</th>
                        </tr>
                    </thead>
                    <tfoot>
                        <tr>
                            <th className="has-text-centered-mobile"><Icon path={mdiStarShooting} size={'1em'} /></th>
                            <th className="has-text-centered-mobile">Position</th>
                            <th className="has-text-centered-mobile">Name</th>
                            <th className={"has-text-centered-mobile " + styles.noWrap}>W/L/T</th>
                            <th className="has-text-centered-mobile">Points</th>
                        </tr>
                    </tfoot>
                    <tbody>
                        {filteredStandings.map((player) => (
                            <PlayerRow
                                key={player.id}
                                player={player}
                                structure={tournamentStructure}
                                onClick={() => { openPlayerMatchup({ player: player, tournament: tournament }) }}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}