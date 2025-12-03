'use client'

import axios, { Axios, AxiosError } from "axios"

type ClientProps = {
    host?: string
}

type GetTournamentsProps = {
    rk9link?: string
    name?: string
    game?: string
    start_date?: string
    status?: string
    order?: string
    page?: string
}

type GetPlayersProps = {
    tournament_id: string   // Needs to be string, number cannot be setted: https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/1568
    name?: string
    division?: string
    placing?: string        // Needs to be string, number cannot be setted: https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/1568
    order?: string
    favs?: string
}

type GetPlayerRoundsProps = {
    player1_id: string      // Needs to be string, number cannot be setted: https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/1568
    player2_id?: string     // Needs to be string, number cannot be setted: https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/1568
    tournament_id?: string  // Needs to be string, number cannot be setted: https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/1568
    order?: string
}

type UserSettingsProps = {
    name: string
    player_id: string
}

type SearchPlayerProps = {
    name: string
}

type MergePlayersProps = {
    player_to_stay_id: string
    player_to_fuse_id: string
}

type ModifyPlayerProps = {
    name: string
    country: string
    player_id: string
}

type UpdateTournamentProps = {
    name: string,
    structure: string,
    autoupdate: number,
}

export type Tournament = {
    created_at: string | null
    end_date: string
    game: string
    id: number
    name: string
    rk9link: string
    start_date: string
    status: string
    updated_at: string | null
    masters_players: number
    seniors_players: number
    juniors_players: number
    pokedata_id: string
    structure: string
    errors?: any
    autoupdate: number
}

export type PlayerTournament = {
    created_at: string | null
    division: string
    drop: number
    id: number
    losses: number
    name: string
    opponents_opponents_resistance: number
    opponents_resistance: number
    placing: number
    points: number
    resistance: number
    ties: number
    tournament_id: number
    player_id: number
    updated_at: string | null
    wins: number
    errors?: any
}

export type PlayerRound = {
    created_at: string | null
    id: number
    player1_id: number
    player2_id: number
    result: string
    round: number
    table: number
    tournament_id: number
    updated_at: string | null
    errors?: any
}

export type User = {
    id: number
    name: string
    email: string
    nick: string
    player_id: number
    player?: Player
    permissions: {
        admin?: boolean
    }
    errors?: any
}

export type Player = {
    id: number
    name: string
    country: string
    errors?: any
}

export type PlayerWithTournaments = Player & {
    playertournaments: PlayerTournamentWithPlayer[]
}

export type PlayerTournamentWithPlayer = PlayerTournament & {
    player: Player
    tournament: Tournament
}

export type Fav = {
    player_id: number
}

export type UserWithFavs = User & {
    favs: Fav[]
}

export default class Client {
    host: string
    axios: Axios

    constructor({host = process.env.NEXT_PUBLIC_BACKEND_URL!}: ClientProps) {
        this.host = host

        this.axios = axios.create({
            baseURL: this.host,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            withXSRFToken: true
        })
    }

    public async getTournaments(props: GetTournamentsProps): Promise<Tournament[]> {
        return (await this.axios.get('/tournament', {params: props})).data as Tournament[]
    }

    public async getTournament(id: string): Promise<Tournament> {
        return (await this.axios.get('/tournament/' + id)).data as Tournament
    }

    public async getPlayersFromTournament(props: GetPlayersProps): Promise<PlayerTournamentWithPlayer[]> {
        return (await this.axios.get('/playertournament', {params: props})).data as PlayerTournamentWithPlayer[]
    }

    public async getPlayerRounds(props: GetPlayerRoundsProps): Promise<PlayerRound[]> {
        return (await this.axios.get('/playerround', {params: props})).data as PlayerRound[]
    }

    public async getPlayer(id:string): Promise<Player> {
        return (await this.axios.get('/player/' + id)).data as Player
    }

    public async getPlayerWithTournaments(id:string): Promise<PlayerWithTournaments> {
        return (await this.axios.get('/player/' + id + '/tournaments')).data as PlayerWithTournaments
    }

    public async searchPlayers(props: SearchPlayerProps): Promise<Player[]> {
        return (await this.axios.get('/player/search', {params: props})).data as Player[]
    }

    public async getFavs(): Promise<Fav[]> {
        return (await this.axios.get('/fav')).data as Fav[]
    }

    public async addFav(id: number): Promise<Fav> {
        return (await this.axios.get('/fav/add/'+id)).data as Fav
    }

    public async removeFav(id: number): Promise<Fav> {
        return (await this.axios.get('/fav/remove/'+id)).data as Fav
    }

    public async getCSRFToken() {
        return (await this.axios.get('/sanctum/csrf-cookie'))
    }

    public async getAuthUser(): Promise<User|null> {
        try {
            const userRequest = await this.axios.get('/auth/user')
            const user = userRequest.data as User
            if (Object.keys(user).length > 0) {
                return user
            }
            return null
        } catch (error) {
            console.error(error)
            return null
        }
    }

    public async updateUserSettings(props: UserSettingsProps) {
        return (await this.axios.post('/user', props)).data as User
    }

    public async mergePlayers(props: MergePlayersProps) {
        return (await this.axios.post('/admin/player/merge', props)).data as Player
    }

    public async modifyPlayer(props: ModifyPlayerProps) {
        return (await this.axios.post('/admin/player/modify', props)).data as Player
    }

    public async getAdminTournaments() {
        return (await this.axios.get('/admin/tournament/list')).data as Tournament[]
    }

    public async getTournamentStructures() {
        return (await this.axios.get('/admin/tournament/structures')).data as string[]
    }

    public async updateTournament(id: string, props: UpdateTournamentProps) {
        return (await this.axios.post('/admin/tournament/'+id, props)).data as Tournament
    }

    public getLoginUrl() {
        return this.host + '/auth/redirect';
    }

    public getLogoutUrl() {
        return this.host + '/auth/logout';
    }

    public async logout() {
        return (await this.axios.get('/auth/logout')).data
    }
}