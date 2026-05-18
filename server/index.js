const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Маршруты
app.use('/auth', require('./routes/auth'))
app.use('/quizzes', require('./routes/quizzes'))

app.get('/hello', (req, res) => {
  res.json({ message: 'Deosol Neo сервер работает!' })
})

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`)
})