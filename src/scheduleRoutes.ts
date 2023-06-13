import { FastifyInstance } from "fastify"
import { prisma } from './lib/prisma'
import { z } from "zod";
import dayjs from "dayjs";

export async function scheduleRoutes(app: FastifyInstance){

	//LISTAR SCHEDULE
	app.get('/schedule', async (req,res) => {

		const schedule = await prisma.schedule.findMany({
			select: {
				id: true,
				description: true,
				date: true,
				clientId: true
			}
		});

		res.status(200).send(schedule)

	});

	// Lista SCHEDULE Unique
	app.get('/schedule/:id', async (req, res) => {

		const  { id } = req.params

		const schedule = await prisma.schedule.findUniqueOrThrow({
			where: {
				id: Number(id)
			}
		});

		res.status(200).send(schedule)

	});

	//CREATE SCHEDULE
	app.post('/schedule', async (req, res) => {

		const scheduleScheme = z.object({
			description: z.string().trim(),
			clientId: z.number(),
			date: z.coerce.date()
		});

		const { clientId, description, date } = scheduleScheme.parse(req.body)

		const schedule = await prisma.schedule.create({
			data: {
				clientId,
				description,
				date: dayjs(date).format()

			}
		})

		res.status(201).send(schedule)

	});

	// Update Schedule
	app.put('/schedule/:id', async (req,res) => {

		const  { id } = req.params

		const scheduleScheme = z.object({
			description: z.string(),
			date: z.coerce.date(),
		});



		const { description , date } = scheduleScheme.parse(req.body)

		const schedule = await prisma.schedule.update({
			where:{
				id: Number(id)
			},
			data:{
				description,
				date
			}
		})

		res.status(200).send(schedule)


	});

	//Delete Schedule
	app.delete('/schedule/:id', async (req, res) => {

		const { id } = req.params

		const schedule = await prisma.schedule.delete({
			where: {
				id: Number(id)
			}
		})

		res.status(200).send("Agendamento deletado com sucesso!")

	});

}
