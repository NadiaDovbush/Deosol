import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'

export default function QuizEditorPage() {
  const { id } = useParams()
  const isNew = id === 'new'
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [questions, setQuestions] = useState([])
  const [quizId, setQuizId] = useState(null)

  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [questionText, setQuestionText] = useState('')
  const [answers, setAnswers] = useState([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ])

  useEffect(() => {
    if (!isNew) {
      api.get(`/quizzes/${id}`).then(res => {
        setTitle(res.data.title)
        setDescription(res.data.description || '')
        setQuestions(res.data.questions)
        setQuizId(res.data.id)
      })
    }
  }, [id, isNew])

  const handleSaveQuiz = async () => {
    try {
      if (isNew) {
        const res = await api.post('/quizzes', { title, description })
        setQuizId(res.data.id)
        navigate(`/quiz/${res.data.id}`, { replace: true })
      } else {
        await api.put(`/quizzes/${id}`, { title, description })
      }
      alert('Викторина сохранена!')
    } catch {
      alert('Ошибка при сохранении')
    }
  }

  const handleSaveQuestion = async () => {
    try {
      const res = await api.post(`/quizzes/${quizId}/questions`, {
        text: questionText,
        answers
      })
      setQuestions([...questions, res.data])
      setQuestionText('')
      setAnswers([
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ])
      setShowQuestionForm(false)
    } catch {
      alert('Ошибка при сохранении вопроса')
    }
  }

  const handleAnswerChange = (index, field, value) => {
    const updated = [...answers]
    if (field === 'isCorrect') {
      updated.forEach((a, i) => a.isCorrect = i === index)
    } else {
      updated[index][field] = value
    }
    setAnswers(updated)
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 20 }}>
      <button onClick={() => navigate('/dashboard')}>← Назад</button>
      <h1>{isNew ? 'Новая викторина' : 'Редактор викторины'}</h1>

      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Название викторины"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8 }}
        />
        <input
          type="text"
          placeholder="Описание (необязательно)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{ width: '100%', padding: 8 }}
        />
      </div>

      <button onClick={handleSaveQuiz} style={{ marginBottom: 24, padding: '10px 20px' }}>
        Сохранить викторину
      </button>

      <h2>Вопросы ({questions.length})</h2>

      {questions.map((q, i) => (
        <div key={q.id} style={{ border: '1px solid #ccc', padding: 12, marginBottom: 8, borderRadius: 8 }}>
          <p><strong>{i + 1}. {q.text}</strong></p>
          {q.answers?.map(a => (
            <p key={a.id} style={{ color: a.isCorrect ? 'green' : 'inherit' }}>
              {a.isCorrect ? '✓' : '○'} {a.text}
            </p>
          ))}
        </div>
      ))}

      {quizId && !showQuestionForm && (
        <button onClick={() => setShowQuestionForm(true)} style={{ padding: '10px 20px' }}>
          + Добавить вопрос
        </button>
      )}

      {showQuestionForm && (
        <div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8, marginTop: 16 }}>
          <h3>Новый вопрос</h3>
          <input
            type="text"
            placeholder="Текст вопроса"
            value={questionText}
            onChange={e => setQuestionText(e.target.value)}
            style={{ width: '100%', padding: 8, marginBottom: 12 }}
          />
          {answers.map((answer, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
              <input
                type="radio"
                name="correct"
                checked={answer.isCorrect}
                onChange={() => handleAnswerChange(i, 'isCorrect', true)}
              />
              <input
                type="text"
                placeholder={`Вариант ${i + 1}`}
                value={answer.text}
                onChange={e => handleAnswerChange(i, 'text', e.target.value)}
                style={{ flex: 1, padding: 8 }}
              />
            </div>
          ))}
          <p style={{ fontSize: 12, color: '#666' }}>Выбери правильный ответ кружочком слева</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={handleSaveQuestion} style={{ padding: '10px 20px' }}>Сохранить вопрос</button>
            <button onClick={() => setShowQuestionForm(false)} style={{ padding: '10px 20px' }}>Отмена</button>
          </div>
        </div>
      )}
    </div>
  )
}