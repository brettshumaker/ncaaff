import { useParams } from 'react-router-dom'

import SingleLeague from 'components/SingleLeague'

const Leagues = () => {
    let { id, slug } = useParams();
    return (
        <SingleLeague id={parseInt(id)} />
    )
}

export default Leagues