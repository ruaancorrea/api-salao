import { FastifyInstance } from "fastify"
import { prisma } from './lib/prisma'
import { z } from "zod";

export async function userRoutes(app: FastifyInstance) {

	// Lista todos os usuarios
	app.get('/user', async (req, res) => {

		const User = await prisma.user.findMany();

		res.status(200).send(User)

	})

	// Cria usuario
	app.post('/user', async (req, res) => {

		const userScheme = z.object({
			name: z.string().trim(),
			email: z.string().email().trim(),
			password: z.string()
		})

		const body = userScheme.parse(req.body)

		const User = await prisma.user.create({
			data: body
		})

		res.status(201).send(User)
	})

	// Lista usuario unico
	app.get('/user/:id', async (req, res) => {

		const {id} = req.params

		const User = await prisma.user.findUnique({
			where: {
				id: Number(id)
			}
		});

		if(!User){
			res.status(404).send("Usuario nao encontrado")
		}

		res.status(200).send(User)

	})

	// Atualiza usuario
	app.put('/user/:id', async (req, res) => {

		const {id} = req.params

		const userScheme = z.object({
			name: z.string().trim(),
			email: z.string().email().trim(),
			password: z.string()
		})



		const { email, name, password } = userScheme.parse(req.body)

		const User = await prisma.user.update({
			where: {
				id: Number(id)
			},
			data:{
				name,
				email,
				password
			}
		});

		res.status(200).send(User)
	})

	// Deleta usuario
	app.delete('/user/:id', async (req, res) => {

		const { id } = req.params

		const User = await prisma.user.delete({
			where: {
				id: Number(id)
			}
		});

		res.status(200).send("Usuario deletado com sucesso!")
	})

}

