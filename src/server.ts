import 'dotenv/config'

import fastify from "fastify";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app = fastify();

const PORT = process.env.PORT
const HOST = process.env.HOST

// Rota Padrao
app.get('/', (req, res) => {

	res.status(200).send('API 1.0')

})

// Lista todos os usuarios
app.get('/user', async (req, res) => {

    const User = await prisma.user.findMany();

    res.status(200).send(User)

})

// Cria usuario
app.post('/user', async (req, res) => {

    const body = req.body

    const User = await prisma.user.create({
        data: body
    })

    res.status(201).send(User)
})

// Lista usuario unico
app.get('/user/:id', async (req, res) => {

    const params = req.params

    const User = await prisma.user.findUnique({
        where: {
            id: Number(params.id)
        }
    });

    if(!User){
        res.status(404).send("Usuario nao encontrado")
    }

    res.status(200).send(User)

})

// Atualiza usuario
app.put('/user/:id', async (req, res) => {

    const params = req.params
    const body = req.body

    const User = await prisma.user.update({
        where: {
            id: Number(params.id)
        },
        data: body
    });

    res.status(200).send(User)
})

// Deleta usuario
app.delete('/user/:id', async (req, res) => {

    const params = req.params

    const User = await prisma.user.delete({
        where: {
            id: Number(params.id)
        }
    });

    res.status(200).send("Usuario deletado com sucesso!")
})

// Lista Client
app.get('/client', async (req, response) => {

	const Client = await prisma.client.findMany({
		select: {
			id: true,
			name: true,
			email: true,
		}
	})

	response.status(200).send(Client)

})

// Lista Client Unique
app.get('/client/:id', async (req, res) => {

	const params = req.params

	const Client = await prisma.client.findUnique({
		where: {
			id: Number(params.id)
		},
		select: {
			id: true,
			name: true,
			email: true,
		}
	})

	return Client

})

// Create Client
app.post('/client', async (req, res) => {

	const body = req.body

	const Client = await prisma.client.create({
		data: body
	})

	res.status(201).send(Client)

})

// Update Client
app.put('/client/:id', async (req,res) => {

	// Pega parametros da URL
	const params = req.params

	// Pega dados do Body da requisiçao
	const body = req.body

	const Client = await prisma.client.update({
		where:{
			id: Number(params.id)
		},
		data: body
	})

	res.status(200).send(Client)

})

// Delete Client
app.delete('/client/:id', async (req, res) => {

	const params = req.params

	const Client = await prisma.client.delete({
		where: {
			id: Number(params.id)
		}
	})

	res.status(200).send(Client)

})


// Rodando o sevidor http
app.listen({
    port: Number(PORT),
    host: HOST
}).then(() => {
    console.log(`Server is running on http://${HOST}:${PORT}`)
})
