import { FastifyInstance } from "fastify"
import { prisma } from './lib/prisma'
import { z } from "zod"

export async function clientRoutes(app: FastifyInstance) {

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

		const {id} = req.params

		const Client = await prisma.client.findUnique({
			where: {
				id: Number(id)
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
	app.post('/client', async (req,res) => {

		const clientScheme = z.object({
			email: z.string().email({ message: "Invalid email address" }).trim(),
			name: z.string().trim(),
			telefone: z.string().trim(),
			cpf: z.string().min(11,{ message: "cpf is not invalid" }).trim(),
			password: z.string().min(8, { message: "password less than 8 characters" } ).trim(),

		});

		const { email, name, telefone, cpf, password } = clientScheme.parse(req.body)

		const Client = await prisma.client.create({
			data: {
				email,
				name,
				cpf,
				telefone,
				password
			}
		})

		res.status(201).send(Client)

	});

	// Update Client
	app.put('/client/:id', async (req,res) => {

		// Pega parametros da URL
		const { id } = req.params

		// Pega dados do Body da requisiçao
		const body = req.body

		const Client = await prisma.client.update({
			where:{
				id: Number(id)
			},
			data: body
		});

		res.status(200).send(Client)

	});

	// Delete Client
	app.delete('/client/:id', async (req, res) => {

		const { id } = req.params

		const Client = await prisma.client.delete({
			where: {
				id: Number(id)
			}
		})

		res.status(200).send("Cliente deletado com sucesso!")

	});

}
