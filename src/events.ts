/* Packages */
import type { Request, Response } from 'express';

/* Open Server-Sent Events connections */
const clients = new Set<Response>();

/* Send a comment every 25 seconds so nginx and browsers don't close idle connections */
const heartbeat = 25000;

setInterval(() => {
	clients.forEach((client) => client.write(': ping\n\n'));
}, heartbeat);

export const events = {
	subscribe: (request: Request, response: Response) => {
		// X-Accel-Buffering stops nginx from holding messages back until its buffer fills
		response.set({
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive',
			'Content-Type': 'text/event-stream',
			'X-Accel-Buffering': 'no',
		});
		response.flushHeaders();

		// Tell browsers to wait 5 seconds before reconnecting if the connection drops
		response.write('retry: 5000\n\n');

		clients.add(response);
		request.on('close', () => clients.delete(response));
	},
	publish: (event: string, data: unknown) => {
		const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
		clients.forEach((client) => client.write(message));
	},
};
