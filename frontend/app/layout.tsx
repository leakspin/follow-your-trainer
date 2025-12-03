import { GeistSans } from "geist/font/sans";
import "./globals.scss";
import Link from "next/link";
import { ModalContextProvider } from "@/hooks/useModal";
import { ReactNode } from "react";
import { KofiButton } from "react-kofi-button";
import Menu from "@/components/menu/Menu";
import { UserContextProvider } from "@/components/context/user/UserContextProvider";
import { CookiesProvider } from "next-client-cookies/server";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Follow Your Trainer",
    description: "Follow Your Trainer is an app designed for you for following players in Pokémon TCG and VGC tournaments.",
    manifest: '/manifest.json',
    icons: {
        icon: '/icons/ios/512.png',
    },
};

export default function RootLayout({
    children,
}: {
    children: ReactNode;
}) {

    return (
        <html lang="en" className={GeistSans.className}>
            <body>
                <ModalContextProvider>
                    <UserContextProvider>
                        <CookiesProvider>
                            <main className="container">
                                {/* <section className="hero">
                                    <div className="hero-body">
                                        <Link href='/'>
                                            <p className="title">Follow Your Trainer</p>
                                        </Link>
                                    </div>
                                </section> */}
                                <Menu />
                                <div>
                                    {children}
                                </div>
                                <footer className="footer">
                                    <div className="content has-text-centered">
                                        <p>

                                            Site created by <Link href='https://adrianmora.dev' target="blank">Adrián Mora</Link>. More info about the website <Link href='/about'>here</Link>.
                                        </p>
                                        <KofiButton username="leakspin" label="Support Me!" />
                                        <p>
                                            This website is not affiliated with, maintained, endorsed or sponsored by The Pokémon Company, RK9 Labs, Pokédata or any of their affiliates. This is an independent, unofficial site. Results shown here are calculated outside of the tournament and are not definitive.
                                        </p>
                                    </div>
                                </footer>
                            </main>
                        </CookiesProvider>
                    </UserContextProvider>
                </ModalContextProvider>
            </body>
        </html>
    );
}
