import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

export default function DashboardPage() {
  const [quizzes, setQuizzes] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/quizzes')
      .then(res => setQuizzes(res.data))
      .catch(() => navigate('/login'))
   }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Мои викторины</h1>
        <button onClick={handleLogout}>Выйти</button>
      </div>

      <Link to="/quiz/new">
        <button style={{ marginBottom: 20, padding: '10px 20px' }}>
          + Создать викторину
        </button>
      </Link>

      {quizzes.length === 0 && <p>У тебя пока нет викторин. Создай первую!</p>}

      {quizzes.map(quiz => (
        <div key={quiz.id} style={{ border: '1px solid #ccc', padding: 16, marginBottom: 12, borderRadius: 8 }}>
          <h3>{quiz.title}</h3>
          <p>{quiz.description}</p>
          <p>Вопросов: {quiz.questions?.length || 0}</p>
          <Link to={`/quiz/${quiz.id}`}>
            <button>Редактировать</button>
          </Link>
        </div>
      ))}
    </div>
  )
}