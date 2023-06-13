import 'dotenv/config'

import fastify from "fastify"
import jwt from '@fastify/jwt'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'

import { userRoutes } from './userRoutes'
import { clientRoutes } from './clientRoutes'
import { scheduleRoutes } from './scheduleRoutes'
import { loginRoutes } from './loginRoutes'

dayjs.locale(ptBr)

const app = fastify();

app.register(jwt, { secret: 'bobesponja' })

app.register(loginRoutes)
app.register(userRoutes)
app.register(clientRoutes)
app.register(scheduleRoutes)

const PORT = process.env.PORT
const HOST = process.env.HOST

// Rota Padrao
app.get('/', (req, res) => {

	res.status(200).send({
		api: "API de Agendamento",
		version: "1.0.0",
		language: "pt-BR"
	})

})

// Rodando o sevidor http
app.listen({
    port: Number(PORT),
    host: HOST
}).then(() => {
    console.log(`Server is running on http://${HOST}:${PORT}`)
})
