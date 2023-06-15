import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { createWriteStream } from "fs";
import { extname, resolve } from "path";
import { promisify } from "util";
import { pipeline } from "stream";

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {

	app.post('/upload', async (req, res) => {

		const upload = await req.file({
			limits: {
				files: 5_242_880 //5mb
			}
		})

		if(!upload){
			return res.status(400).send()
		}

		const mimeTypeRegex = /^(image)\/[a-zA-Z]+/
		const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)

		if(!isValidFileFormat){
			return res.status(400).send()
		}

		// Gera ID aleatorio tipo ex: 1234-1234-1234-1234-1234
		const fileId = randomUUID()

		// Pega a extensao do arquivo ex: .jpg
		const extension = extname(upload.filename)

		// junta o nome a extensao
		const fileName = fileId.concat(extension)

		// Defini os caminhos de origem, destino e nome do arquivo
		const writeStream = createWriteStream(resolve(__dirname, '../../uploads/', fileName))

		// Executa o envio do arquivo
		await pump(upload.file, writeStream)

		// Formata url de acesso a imagem enviada
		const fullUrl = req.protocol.concat('://').concat(req.hostname)
		const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString()

		return { fileUrl }

	})

}
