import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createHashRouter, RouterProvider, useLocation} from 'react-router-dom'

import Home from './routes/home.jsx'
import Awards from './routes/awards.jsx'
import BookChapters from './routes/bookChapters.jsx'
import JournalPublications from './routes/journalPublications.jsx'
import ConferencePapers from './routes/conferencePapers.jsx'
import Projects from './routes/projects.jsx'
import Login from './routes/usuario/login.jsx'
import Agregar from './routes/usuario/agregar.jsx'
import App from './App.jsx'

const router = createHashRouter([
  {
    path:'/',
    element: <App/>,
    children: [
      {
        path:'/',
        element: <Home/>
      },
      {
        path:'/awards',
        element: <Awards/>
      },
      {
        path:'/bookChapters',
        element: <BookChapters/>
      },
      {
        path:'/journalPublications',
        element: <JournalPublications/>
      },
      {
        path:'/conferencePapers',
        element: <ConferencePapers/>
      },
      {
        path:'/projects',
        element: <Projects/>
      },
      {
        path:'/login',
        element: <Login/>
      },
      {
        path:'/agregar/:ubicacion',
        element: <Agregar/>
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
