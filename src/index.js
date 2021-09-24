import { render } from 'react-dom'
import './style.scss'

import App from 'App'
import { AppProviders } from 'context'

render(
    <AppProviders>
        <App />
    </AppProviders>
, document.getElementById('root'))