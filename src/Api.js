import axios from 'axios'

const footballToken = '1339ffc54beb4e3783846e31d63d9c5d'


export const getMatches = () => {
    return axios.get('http://api.football-data.org/v2/competitions/2013/matches',{headers:{'X-Auth-Token': `${footballToken}`}})
}


