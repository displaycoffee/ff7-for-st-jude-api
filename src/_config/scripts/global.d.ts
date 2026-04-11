/* Type definitions */
type TokenRequest = {
	access_token: string;
	created_at: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
	token_type: string;
};

declare global {
	/* Declare global types */
	type TokenRequestType = TokenRequest;
}

/* Export global types */
export {};
