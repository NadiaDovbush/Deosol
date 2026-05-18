const express = require('express')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

app.get('/hello', (req, res) => {
  res.json({ message: 'Deosol Neo сервер работает!' })
})

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`)
})