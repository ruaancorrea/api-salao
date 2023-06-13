import { FastifyInstance } from "fastify"
import { prisma } from './lib/prisma'

export async function loginRoutes (app: FastifyInstance) {

	app.post("/user/login", async (req, res) => {

		const body = req.body

		const User = await prisma.user.findMany({
			where: {
				email: body.email
			}
		})

		if(User[0].email === body.email && User[0].password === body.password){
			res.status(200).send("Logado com sucesso!")
		}else{
			return "Falha ao fazer login"
		}
	})

	app.post("/client/login", async (req, res) =>	{

		const body = req.body

		const Client = await prisma.client.findMany({
			where: {
				email: body.email
			}
		})

		if(Client[0].email === body.email && Client[0].password === body.password){
			res.status(200).send("Logado com sucesso!")
		}else{
			return "Falha ao fazer login"
		}

	})

}
