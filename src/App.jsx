
import { useState } from 'react'
import './App.css'

export default function App() {
  const [text, setText] = useState('')
  const [items, setItems] = useState([])

  function addItem(e) {
    e.preventDefault()

    if (!text.trim()) return

    setItems([...items, {
      id: Date.now(),
      name: text.trim()
    }])

    setText('')
  }

  return (
    <main className="app">
      <h1>Моё приложение</h1>
      <p>Первое PWA на React</p>

      <form onSubmit={addItem}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Введите название"
        />
        <button type="submit">Добавить</button>
      </form>

      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </main>
  )
}
