import 'dotenv/config'

import fastify from "fastify"
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'

import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'

import { userRoutes } from './routes/userRoutes'
import { clientRoutes } from './routes/clientRoutes'
import { scheduleRoutes } from './routes/scheduleRoutes'
import { loginRoutes } from './routes/loginRoutes'
import { uploadRoutes } from './routes/uploadRoutes'
import { resolve } from 'path'

dayjs.locale(ptBr)

const app = fastify();

app.register(jwt, { secret: 'bobesponja' })
app.register(multipart)
app.register(fastifyStatic, {
	prefix: '/uploads', // Rota
	root: resolve(__dirname, '../uploads'), // Caminho da Imagem
})

app.register(loginRoutes)
app.register(uploadRoutes)
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
