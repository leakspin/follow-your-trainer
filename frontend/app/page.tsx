'use client'

import { useEffect, useState } from "react";
import TournamentHeader from "@/components/tournaments/header/TournamentHeader";
import Client, { Tournament } from "@/utils/backend/client";
import styles from './styles.module.scss';

export default function Index() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [page, setPage] = useState<number>(1)
  const backend = new Client({})

  useEffect(() => {
    const fetchTournaments = async () => {
      const data = await backend.getTournaments({order: '-start_date', page: page.toString()})

      if ("errors" in data) {
        console.error(data)
      } else {
          setTournaments([...tournaments, ...data]);
      }
    }

    fetchTournaments();
  }, [page])

  function loadMore() {
    setPage(page + 1)
  }

  return (
    <div>
      {tournaments.map((tournament) => (
          <TournamentHeader
            key={tournament.id}
            tournament={tournament}
            showStandingsButton={true}
            showWinners={true}
            showLinks={false}
          />
      ))}
      <button className={"button is-link " + styles.loadMore} onClick={loadMore}>Load More</button>
    </div>
  );
}
