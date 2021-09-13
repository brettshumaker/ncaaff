import { useState, useEffect } from "react"
import CardWrapper from 'components/Card/_CardWrapper'

const MainContent = () => {
    // SiteID
    // Nav


    const [data, setData] = useState( null );
    const [loading, setLoading] = useState( true );
    const [error, seterror] = useState( null );

    useEffect(() => {
        fetch('http://site.api.espn.com/apis/site/v2/sports/football/college-football/teams?limit=1000&groups=80')
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw response
            })
            .then(data => {
                const teams = data.sports[0].leagues[0].teams;
                setData(teams)
            })
            .catch(error => {
                console.error("There was an error fetching the error.");
                setError(error)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    if (loading) return "Loading..."
    if (error) return "Error!"

    return (
            <div id="main">
                <CardWrapper data={data} />
            </div>
    )
}

export default MainContent