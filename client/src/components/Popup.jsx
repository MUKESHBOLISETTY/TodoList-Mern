import React from 'react'
import './Popup.css'
const Popup = ({ popupmessage }) => {
  return (
    <div className="popup">
        {popupmessage}
        </div>
  )
}

export default Popup