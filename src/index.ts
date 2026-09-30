/* Packages */
import express from 'express';
import cors from 'cors';

/* Scripts */
import { variables } from './_core/scripts/variables';
import router from './router';

/* Set Express app */
const app = express();

/* Set CORS origins (main site, Vercel production alias, and Vercel preview deployments) and router */
const allowedOrigins = [
	variables.corsOrigin,
	'https://ff7-for-st-jude.vercel.app',
	/^https:\/\/ff7-for-st-jude-[a-z0-9-]+-displaycoffee\.vercel\.app$/,
];
app.use(cors({ origin: allowedOrigins }));
app.use('/', router);

/* HEY! LISTEN!! */
app.listen(variables.port, () => {
	console.log(`🏃 Running in ${variables.environment} mode`);
	console.log(`⚡️ Server is running at ${variables.url}`);
});
