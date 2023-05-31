import 'dotenv/config'

import fastify from "fastify";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app = fastify();

const PORT = process.env.PORT
const HOST = process.env.HOST

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



// Rodando o sevidor http
app.listen({
    port: Number(PORT),
    host: HOST
}).then(() => {
    console.log(`Server is running on http://${HOST}:${PORT}`)
})
