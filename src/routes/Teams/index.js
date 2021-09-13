import { useParams } from 'react-router-dom'

import SingleTeam from 'components/SingleTeam'

const Teams = () => {
    let { id, slug } = useParams();
    return (
        <SingleTeam id={id} />
    )
}

export default Teams