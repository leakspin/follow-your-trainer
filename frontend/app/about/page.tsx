import Link from "next/link";

export default function Page() {
    return (
        <div className="content">
            <p>
            Hi! My name is <Link href='https://adrianmora.dev' target="blank">Adrián Mora</Link>. I'm the main developer of Follow Your Trainer, a website created to follow and check results from different tournaments of the Play! Pokémon circuit.
            </p>
            <p>
                I've been playing since the launch of Scarlet and Violet (March 2023) and I am an avid competitor of the scene, so having an application like this one is very useful for me.
            </p>
            <h4 className="title is-4">Acknowledges</h4>
            <p>
                This site is no invention of mine. <Link href='https://twitter.com/_JuHlien_' target="blank">Julien</Link> has a very powerful tool used by many called <Link href='https://pokedata.ovh' target='blank'>Pokedata.ovh</Link> that is the basis of this application. I use its API to feed the database and present you, in a more beautiful way, the results of the standings of every tournament.
            </p>
            <p>
                There was another application some time ago called <Link href='http://www.ptcgstats.com/' target="blank">Pokestats</Link>, developed by <Link href='https://twitter.com/jgrimesey' target="blank">Jared Grimes</Link>. He is another competitor in the Pokémon TCG scene and did a really helpful tool, but sadly he took it down for <Link href='https://jaredgrimes.me/2024/03/24/pokestats-live/' target="blank">his own reasons</Link>. It is a huge inspiration for this tool too.
            </p>
        </div>
    )
}