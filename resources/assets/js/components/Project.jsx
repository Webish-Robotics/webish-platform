/**
 * ===========================================================
 * WEBISH - an extreme fast WEB APP to serve EV3 some sparkles
 *
 * @author Vrinceanu Radu-Tudor, student @ National College "Vasile Alecsandri", Galati, RO
 * @package resources/assets/js/components/
 *
 * THIS SOFTWARE IS AS IT IS ANY MODIFICATION WITHOUT THE CONSENT OF THE AUTHOR WILL BE
 * DISPUTED IN TERMS OF THE PROJECT'S LICENSE.
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { ControlledEditor } from '@monaco-editor/react'
import { useHotkeys } from 'react-hotkeys-hook'
import axios from 'axios'
import io from 'socket.io-client'

const { useState } = React
const WEBSOCKET_SERVER = 'ws://localhost:8080/'
const socket = io(WEBSOCKET_SERVER, {transports: ['websocket']})

/**
 * This is the main Project JSX Functional Component
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function Project({ ...props }) {
  const project = JSON.parse(props.project)
  const user = JSON.parse(props.user)
  const team = JSON.parse(props.team)

  // HANDLE THE SOCKET CONNECTION
  socket.on('connect', () => {
    socket.emit('/joinable', `${team.name}\nSTUDENT`)
  })


  // STATES & REFERENCES
  const [saveButton, setSaveButton] = useState(false)
  const [executeButton, setExecuteButton] = useState(true)
  const [code, setCode] = useState(JSON.parse(project.details).code)
  const [theme, setTheme] = useState('dark')
  const [alert, setAlert] = useState(false)

  // HOTKEY TO SAVE THE PROJECT WHEN CONTROL + S (MacOS) OR CTRL + S (Windows) IS PRESSED
  // BASED ON THE DEPS WE CAN SEEK IF THE code IS CHANGED
  // USE THE OPTIONS PARAMETER AS AN OBJECT TO MAKE THE HOTKEY WORK INSIDE THE COMPONENT ControlledEditor
  useHotkeys('ctrl+s', () => handleSaveButton(), {
    enableOnTags: ['INPUT', 'TEXTAREA', 'SELECT']
  }, [code])

  // THE FEEDBACK BASED SYSTEM
  socket.on('/results', function (data) {
    if (user.username === data.username) {
      setAlert(!data.code ? "The code was executed with success, congrats 😁👏" : `The code was not executed, error details: ${data.message}`)
    }
  })

  // FUNCTIONS
  const handleExecuteButton = () => {
    handleSaveButton()
    socket.emit('/execution', {
      code: code,
      user: user.username,
      room: `${team.name}\n`,
    })
    setExecuteButton(false)
  }
  const handleEditorCode = (ev, value) => {setSaveButton(true); setCode(value)}
  const handleSaveButton = async () => await axios
      .patch(`/dashboard/${project.id}`, {code: code}).then(() => setSaveButton(false))
  const handleThemeButton = () => theme === 'dark' ? setTheme('white') : setTheme('dark')

  return (
    <>
      {
        alert &&
        <div className="w-100 bg-orange text-center menu-height d-flex align-items-center">
          <div className="container-fluid">
            {alert}

            <button className="btn-sm btn-fogra text-snow mx-2" onClick={() => setAlert(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      }
      <div className={`w-100 ${theme !== 'dark' ? 'bg-snow' : 'bg-fogra'} menu-height d-flex align-items-center justify-content-center`}>
        <div className="text-center">
        {
          saveButton &&
          <button className="btn btn-orange btn-sm text-white mx-1" onClick={handleSaveButton}><i className="fas fa-save"></i> Save</button>
        }
        {
          executeButton &&
          <button onClick={handleExecuteButton} className="btn btn-success btn-sm text-white mx-1"><i className="fas fa-play"></i> Execute</button>
        }
        <button className={`btn ${theme === 'dark' ? 'btn-snow' : 'btn-fogra'} btn-sm text-white mx-1`} onClick={handleThemeButton}>{theme === 'dark' ? <i className="fas text-black fa-sun"></i> : <i className="fas text-white fa-moon"></i>}</button>
        </div>
      </div>
      <div className="row g-0">
        <div className="col-md-12 col-lg-12 min-vh-100">
          <ControlledEditor value={code} language="python" theme={theme} onChange={handleEditorCode} />
        </div>
      </div>
    </>
  )
}

if (document.getElementById('project-component')) {
  const props = Object.assign({}, document.getElementById('project-component').dataset);
  ReactDOM.render(<Project {...props} />, document.getElementById('project-component'))
}
