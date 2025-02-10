import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import SocketProvider from './store/SocketProvider.jsx';
import DrawingBoard from './components/DrawingBoard.jsx';
import {Provider} from "react-redux"
import store from "./store/index.js"
import Initial from './Pages/Initial.jsx';
import Lobby from './Pages/Lobby.jsx';
import GameContextWrapper from './store/GameContext.jsx';
import Select from './components/Select.jsx';
const router=createBrowserRouter([
  {
    path:"/",
    element:<SocketProvider><GameContextWrapper><App></App></GameContextWrapper></SocketProvider>,
    children:[
      {
        path:"/",
        element:<Initial></Initial>,
        index:true
      },
      {
        path:"/room/:id",
        element:<><Lobby></Lobby></>
      },
      {
        path:"/AataAarambam",
        element:<DrawingBoard></DrawingBoard>
      },
      {
        path:"/testing",
        element:<Select></Select>
      }
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}>
    <RouterProvider router={router}></RouterProvider>
    </Provider>
  </>,
)
