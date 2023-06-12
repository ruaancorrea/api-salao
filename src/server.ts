import 'dotenv/config'

import fastify from "fastify";
import z from 'zod'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import { PrismaClient } from '@prisma/client'

dayjs.locale(ptBr)

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

//LISTAR SCHEDULE
app.get('/agenda', async (req,res) => {

    const agenda = await prisma.schedule.findMany({
		select: {
			id: true,
			description: true,
			date: true,
			clientId: true
		}
	});

    res.status(200).send(agenda)

});

// Lista SCHEDULE Unique
app.get('/agenda/:id', async (req, res) => {

	const  { id } = req.params

	const agenda = await prisma.schedule.findUniqueOrThrow({
        where: {
            id: Number(id)
		}
	});

	res.status(200).send(agenda)

});

//CREATE SCHEDULE

app.post('/agenda', async (req, res) => {

	const agendaScheme = z.object({
		description: z.string().trim(),
		clientId: z.number(),
		date: z.coerce.date()
	});

	const { clientId, description, date } = agendaScheme.parse(req.body)

	const agenda = await prisma.schedule.create({
		data: {
			clientId,
			description,
			date: dayjs(date).format()

		}
	})

	res.status(201).send(agenda)

});


// Update Schedule

app.put('/agenda/:id', async (req,res) => {

    const  { id } = req.params

	const agendaScheme = z.object({
		description: z.string(),
		date: z.coerce.date(),
	});



    const { description , date } = agendaScheme.parse(req.body)

	const agenda = await prisma.schedule.update({
		where:{
			id: Number(id)
		},
		data:{
			description,
			date
		}
	})

	res.status(200).send(agenda)


});

//Delet Schedule

app.delete('/agenda/:id', async (req, res) => {

	const { id } = req.params

	const Agenda = await prisma.schedule.delete({
		where: {
			id: Number(id)
		}
	})

	res.status(200).send("Agendamento deletado com sucesso!")

});



// Rodando o sevidor http
app.listen({
    port: Number(PORT),
    host: HOST
}).then(() => {
    console.log(`Server is running on http://${HOST}:${PORT}`)
})
