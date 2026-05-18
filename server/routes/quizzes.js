const express = require('express')
const { PrismaClient } = require('@prisma/client')
const auth = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// Получить все викторины пользователя
router.get('/', auth, async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: { authorId: req.userId },
      include: { questions: true }
    })
    res.json(quizzes)
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// Создать викторину
router.post('/', auth, async (req, res) => {
  try {
    const { title, description } = req.body
    const quiz = await prisma.quiz.create({
      data: { title, description, authorId: req.userId }
    })
    res.json(quiz)
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// Получить одну викторину с вопросами
router.get('/:id', auth, async (req, res) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { questions: { include: { answers: true } } }
    })
    res.json(quiz)
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// Добавить вопрос к викторине
router.post('/:id/questions', auth, async (req, res) => {
  try {
    const { text, timeLimit, answers } = req.body
    const question = await prisma.question.create({
      data: {
        text,
        timeLimit: timeLimit || 20,
        quizId: parseInt(req.params.id),
        answers: {
          create: answers
        }
      },
      include: { answers: true }
    })
    res.json(question)
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// Удалить викторину
router.delete('/:id', auth, async (req, res) => {
  try {
    await prisma.quiz.delete({
      where: { id: parseInt(req.params.id) }
    })
    res.json({ message: 'Викторина удалена' })
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

module.exports = router