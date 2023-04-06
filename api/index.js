
import express from 'express'
import logger from './middleware/loggerMiddleware.js'
import notFound from './middleware/notFoundMiddleware.js'
import errorResponse from './middleware/handleErrorsMiddleware.js'
import cors from 'cors'
import './mongo.js'
import dotenv from 'dotenv'
import notesRouter from './controllers/notes.js'
import usersRouter from './controllers/users.js'
import loginRouter from './controllers/login.js'
import testingRouter from './controllers/testing.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(logger)
// servir estáticos
app.use(express.static('../app/build'))

app.get('/', (req, res) => {
  res.send(process.env.MONGO_DB_U)
})

/** Middlewares */
app.use('/api/login', loginRouter)
app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)

// TODO: import inline ??
if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter)
}

app.use(notFound)
app.use(errorResponse)

const server = app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})

export { app, server }
