/* Packages */
import express from 'express';

/* Scripts */
import Client from './client';
import { events } from './events';
import { webhooks } from './webhooks';

/* Set up router and client */
const router = express.Router();
const tiltifyClient = new Client();

/* Live updates for the site and overlay (registered before the proxy so it doesn't get forwarded to Tiltify) */
router.get('/api/events', events.subscribe);

/* Tiltify webhooks (raw body is needed to verify the signature) */
router.post('/api/webhooks/tiltify', express.raw({ type: 'application/json' }), (request, response) => {
	const body = request.body as Buffer;

	if (!Buffer.isBuffer(body) || !webhooks.verify(request.header('X-Tiltify-Signature'), request.header('X-Tiltify-Timestamp'), body)) {
		response.status(401).send({ error: 'Invalid signature' });
		return;
	}

	// Respond right away, Tiltify deactivates the endpoint if it keeps failing
	response.sendStatus(200);

	try {
		const payload = JSON.parse(body.toString('utf8')) as WebhookPayloadType;
		if (webhooks.isDuplicate(payload.meta.id)) return;

		events.publish('update', {
			type: payload.meta.event_type,
			data: payload.data,
		});
	} catch (error) {
		console.error('Webhook error:', error);
	}
});

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
