import Cors from 'cors'
import initMiddleware from '../../lib/init-middleware'

const cors = initMiddleware(
	// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
	Cors({
	  // Only allow requests with GET, POST and OPTIONS
	  methods: ['GET', 'POST', 'OPTIONS'],
	})
  )

export default async (req, res) => {

	await cors(req, res)

	res.status(200).json({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY
	})
}
