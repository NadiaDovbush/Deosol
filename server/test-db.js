const { Client } = require('pg')
require('dotenv').config()

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

client.connect()
  .then(() => {
    console.log('Подключение успешно!')
    return client.end()
  })
  .catch(err => console.error('Ошибка:', err))