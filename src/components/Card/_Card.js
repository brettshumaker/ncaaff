import styled from 'styled-components'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams 
} from 'react-router-dom'

const StyledCard = styled.div`
    background: #${props => props.primary}33;
    border-radius: 3px;
    border: 2px solid #${props => props.alternateColor};
    color: black;
    margin: .5em;
    padding: 1em;
    box-shadow: 2px 2px 2px #00000033;
    img {
        text-align: center;
    }
`

const Card = ( { team } ) => {
    if ( "Ohio State Buckeyes" === team.displayName ) {
        fetch(`https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/${team.id}`)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw response
        })
        .then(data => {
            console.log('from teams endpoint',data)
        })

        console.log('existing data',team)

        // http://site.api.espn.com/apis/site/v2/sports/football/college-football/rankings
        fetch(`http://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?groups=80&limit=1000`)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw response
        })
        .then(data => {
            console.log(data)
        })
    }
    return (
        <StyledCard key={team.id+'_'+team.slug} className="team-card" primary={team.color} alt={team.alternateColor}>
            <img src={team.logos[0].href} width="100" alt={team.displayName} />
            <Link to={`/teams/${team.id}/${team.slug}`}>
                <h4>{team.displayName}</h4>
            </Link>
            <p>Record: {team.record.items[0].summary}</p>
        </StyledCard>
    )
}

export default Card