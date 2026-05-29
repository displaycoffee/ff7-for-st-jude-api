/* Packages */
import express from 'express';

/* Scripts */
import Client from './client';

/* Set up router and client */
const router = express.Router();
const tiltifyClient = new Client();

/* Route to Tiltify Client */
router.get('/*path', async (request, response) => {
	try {
		const data = await tiltifyClient.request(request.url);
		response.send(data);
	} catch (error) {
		console.error('Router error:', error);
		response.status(500).send({ error: 'Internal server error' });
	}
});

export default router;
