/* Packages */
import dotenv from 'dotenv';
dotenv.config();

/* Check if environment variables are available */
const requiredEnvs = ['API_URL', 'CORS_ORIGIN', 'TILTIFY_CLIENT_ID', 'TILTIFY_CLIENT_SECRET'] as const;

for (const env of requiredEnvs) {
	if (!process.env[env]) {
		console.error(`❌ Missing required environment variable: ${env}`);
		process.exit(1); // Stop the app immediately
	}
}

/* This config contains variables to use through application */
export const variables = {
	client: {
		id: process.env.TILTIFY_CLIENT_ID! as string,
		secret: process.env.TILTIFY_CLIENT_SECRET! as string,
	},
	corsOrigin: process.env.CORS_ORIGIN! as string,
	environment: process.env.NODE_ENV as 'development' | 'production',
	port: parseInt(process.env.PORT ?? '3002', 10) as number,
	tiltify: 'https://v5api.tiltify.com',
	url: process.env.API_URL! as string,
};
