/* Packages */
import crypto from 'node:crypto';

/* Scripts */
import { variables } from './_core/scripts/variables';

/* Tiltify recommends rejecting timestamps older than a minute, this allows a little extra for clock drift */
const tolerance = 5 * 60 * 1000;

/* Remember recent event ids, since retries can deliver the same event more than once */
const seenLimit = 500;
const seen = new Set<string>();

export const webhooks = {
	verify: (signature: string | undefined, timestamp: string | undefined, body: Buffer) => {
		if (!signature || !timestamp) return false;

		// Reject old or invalid timestamps so a captured request can't be replayed later
		const age = Math.abs(Date.now() - new Date(timestamp).getTime());
		if (Number.isNaN(age) || age > tolerance) return false;

		// Tiltify signs "{timestamp}.{raw body}" with HMAC-SHA256 and base64 encodes it
		const expected = crypto.createHmac('sha256', variables.webhookSecret).update(`${timestamp}.`).update(body).digest();
		const received = Buffer.from(signature, 'base64');

		return received.length === expected.length && crypto.timingSafeEqual(received, expected);
	},
	isDuplicate: (id: string) => {
		if (seen.has(id)) return true;

		// Sets keep insertion order, so the first value is always the oldest
		seen.add(id);
		if (seen.size > seenLimit) seen.delete(seen.values().next().value!);

		return false;
	},
};
