import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    {/* <StarRating maxRating={10}/>
    <StarRating maxRating={5} message={["Terrible", "Bad", "Okay", "Good", "Great"]}/> */}
  </React.StrictMode>,
)
