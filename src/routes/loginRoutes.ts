import { FastifyInstance } from "fastify"
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

export async function loginRoutes (app: FastifyInstance) {

	app.post("/user/login", async (req, res) => {

		const body = req.body

		const User = await prisma.user.findMany({
			where: {
				email: body.email
			}
		})

		const login = await bcrypt.compare(body.password, User[0].password)

		if(login){

			const token = app.jwt.sign(
				{
					id: User[0].id,
					name: User[0].name,
					email: User[0].email,
				},{
					expiresIn: 86400
				}
			)

			res.status(200).send({ token })

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

			const token = app.jwt.sign(
				{
					id: Client[0].id,
					name: Client[0].name,
					email: Client[0].email,
				},{
					expiresIn: 86400
				}
			)

			res.status(200).send({ token })

		}else{
			return "Falha ao fazer login"
		}

	})

}
