import '~/styles/index.css'

import { StrictMode, createElement } from 'react'
import { createRoot } from 'react-dom/client'

import App from '~/app'

const app = document.createElement('main')
const root = createRoot(app)

document.body.appendChild(app)
root.render(createElement(StrictMode, null, createElement(App)))
