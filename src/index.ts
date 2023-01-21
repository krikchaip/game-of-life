import '~/styles/index.css'

import React from 'react'
import ReactDOM from 'react-dom'

import App from '~/app'

const app = document.createElement('main')
document.body.appendChild(app)

ReactDOM.render(React.createElement(App), app)
