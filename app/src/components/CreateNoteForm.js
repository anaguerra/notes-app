import { useState, useRef } from 'react'
import Togglable from './Togglable'

const CreateNoteForm = ({ createNewNoteAndAddToList }) => {
  const [newNote, setNewNote] = useState('')
  const togglableRef = useRef()

  const handleChange = (event) => {
    setNewNote(event.target.value)
  }

  const handleAdd = (event) => {
    event.preventDefault()

    const noteObject = {
      content: newNote,
      important: false
    }

    createNewNoteAndAddToList(noteObject)
    setNewNote('')
    togglableRef.current.toggleVisibility()
  }

  return (
    <Togglable buttonLabel='New note' ref={togglableRef}>
      <h3>Create a new note</h3>

      <form onSubmit={handleAdd}>
        <input
          placeholder='Escriba el texto de la nota'
          name='noteContent'
          type='text'
          onChange={handleChange}
          value={newNote}
        />
        <button>Crear nota</button>
      </form>
    </Togglable>
  )
}

export default CreateNoteForm
