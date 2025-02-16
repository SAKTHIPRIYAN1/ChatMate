import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import store from './Store/store'
import {Provider} from 'react-redux';
import { SocketProvider } from './SocketContext';
import { LoadingProvider } from "./components/Loadingcontext";
import { Toaster,toast } from "react-hot-toast";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <LoadingProvider>
        <Provider store={store}>
            <SocketProvider >
                <Toaster />
              <App />
            </SocketProvider>
        </Provider>
      </LoadingProvider>
    </BrowserRouter>
  </StrictMode>

)
