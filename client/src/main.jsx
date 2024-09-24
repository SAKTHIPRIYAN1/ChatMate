import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Load from './components/Loader'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import store from './Store/store'
import {Provider} from 'react-redux';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>
  </StrictMode>

)
