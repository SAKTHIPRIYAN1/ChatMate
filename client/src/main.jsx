import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Load from './components/Loader'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import store from './Store/store'
import {Provider} from 'react-redux';
import { SocketProvider } from './SocketContext'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <Provider store={store}>
          <SocketProvider >
            <App />
          </SocketProvider>
        </Provider>
    </BrowserRouter>
  </StrictMode>

)
