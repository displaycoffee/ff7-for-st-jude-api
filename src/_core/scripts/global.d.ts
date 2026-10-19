/* Type definitions */
type TokenRequest = {
	access_token: string;
	created_at: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
	token_type: string;
};

type WebhookPayload = {
	data: Record<string, unknown>;
	meta: {
		attempted_at: string;
		event_type: string;
		generated_at: string;
		id: string;
		subscription_source_id: string;
		subscription_source_type: string;
	};
};

declare global {
	// Declare global types
	type TokenRequestType = TokenRequest;
	type WebhookPayloadType = WebhookPayload;
}

/* Export global types */
export {};
