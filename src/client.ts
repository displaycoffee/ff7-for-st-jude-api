/* Packages */
import fetch from 'node-fetch';

/* Local scripts */
import { variables } from './_config/scripts/variables';

class Client {
	clientId: string;
	clientSecret: string;
	token: string | null = null;
	tokenExpiresAt: number | null = null;

	constructor() {
		// Get oauth credentials from environment variables
		this.clientId = variables.client.id;
		this.clientSecret = variables.client.secret;
	}

	// Check if token has expired
	isTokenValid() {
		return this.token !== null && this.tokenExpiresAt !== null && Date.now() < this.tokenExpiresAt;
	}

	async getAccessToken(): Promise<{ access_token: string }> {
		// Set query parameters
		const params = new URLSearchParams({
			client_id: this.clientId,
			client_secret: this.clientSecret,
			grant_type: 'client_credentials',
		});

		// Set fetch options
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		// Set API url
		const url = `${variables.tiltify}/oauth/token?${params}`;

		// Try to get access token
		try {
			const response = await fetch(url, options);
			const json = (await response.json()) as TokenRequestType;
			this.token = json.access_token;

			// Store expiry with a 60s buffer so we refresh before it actually expires
			this.tokenExpiresAt = Date.now() + (json.expires_in - 60) * 1000;
			return json;
		} catch (error) {
			console.error('Error fetching access token:', error);
			throw error;
		}
	}

	async request(path: string) {
		// Get initial token or refresh if expired
		try {
			if (!this.isTokenValid()) {
				await this.getAccessToken();
			}
		} catch (error) {
			console.error('Error getting access token:', error);
			return null;
		}

		// Set fetch options
		const options = {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${this.token}`,
			},
		};

		// Set API url
		const url = `${variables.tiltify}${path}`;

		// Fetch whatever path was requested to proxy API
		try {
			let response = await fetch(url, options);

			// If unauthorized, force a token refresh and try once more
			if (response.status === 401) {
				this.token = null;
				this.tokenExpiresAt = null;
				await this.getAccessToken();
				response = await fetch(url, { ...options, headers: { Authorization: `Bearer ${this.token}` } });
			}

			return await response.json();
		} catch (error) {
			console.error('Error making API request:', error);
			return null;
		}
	}
}

export default Client;
