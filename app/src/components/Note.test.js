import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import Note from './Note'
import { prettyDOM } from '@testing-library/dom'

test('renders content', () => {
  const note = {
    content: 'this is a note',
    important: true
  }

  const component = render(<Note note={note} />)

  component.getByText('this is a note')
  component.getByText('make not important')

  // otra forma
  // expect(component.container).toHaveTextContent(note.content)

  // component.debug()
  const li = component.container.querySelector('li')
  console.log(prettyDOM(li))
})

test('Click the button calls event handler once', () => {
  const note = {
    content: 'this is a note',
    important: true
  }

  const mockHandler = jest.fn()

  const component = render(<Note note={note} toggleImportance={mockHandler} />)

  const button = component.getByText('make not important')
  fireEvent.click(button)

  // 2 formas de hacerlo
  expect(mockHandler).toHaveBeenCalledTimes(1)
  // expect(mockHandler.mock.calls).toHaveLength(1)
})
