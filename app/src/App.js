import { useEffect, useState } from 'react'
import * as noteService from './services/notes'
import login from './services/login'
import LoginForm from './components/LoginForm'
import CreateNoteForm from './components/CreateNoteForm'
import Note from './components/Note'
import Notification from './components/Notification'

const App = (props) => {
  const [notes, setNotes] = useState([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState('')
  const [showAll, setShowAll] = useState(true)

  // hook para después del renderizado
  useEffect(() => {
    setLoading(true)

    noteService.getAll().then((notes) => {
      setNotes(notes)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, []) // array de dependencias vacío significa que sólo se va a ejecutar la primera vevz

  const createNewNoteAndAddToList = (noteObject) => {
    noteService.create(noteObject)
      .then(newNote => {
        setNotes((prevNotes) => prevNotes.concat(newNote))
      }).catch(error => {
        setError(error)
      })
  }

  const handleLogin = async (event) => { // se podría hacer con promesas también
    event.preventDefault()

    // el problema de los await es que necesitan try/catch
    try {
      const user = await login({
        username,
        password
      })

      window.localStorage.setItem(
        'loggedNoteAppUser', JSON.stringify(user)
      )

      noteService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setError('Login error')
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    noteService.setToken(null)
    window.localStorage.removeItem('loggedNoteAppUser')
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setError(
          `Note '${note.content}' was already removed from server ${error.message}`
        )
        setTimeout(() => {
          setError(null)
        }, 5000)
      })
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  let button
  if (user) {
    button = <button onClick={handleLogout}> Cerrar sesión </button>
  }

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={error} />

      {loading ? 'Cargando...' : ''}

      {
        user
          ? <CreateNoteForm
              createNewNoteAndAddToList={createNewNoteAndAddToList}
            />
          : <LoginForm
              username={username}
              password={password}
              handleUsernameChange={
                (event) => setUsername(event.target.value)
              }
              handlePasswordChange={
                (event) => setPassword(event.target.value)
              }
              handleLogin={handleLogin}
            />
      }

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>

      {button}

      {console.log(notesToShow)}

      <ul>
        {notesToShow.map((note, i) =>
          <Note
            key={i}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}

        {/* {notes
          .map((note) => (
            <Note key={note.id} {...note} />
          ))
        } */}

      </ul>
      <br /><br />
    </div>
  )
}

export default App
