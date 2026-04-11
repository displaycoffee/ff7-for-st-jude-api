/* Packages */
import express from 'express';
import cors from 'cors';

/* Local scripts */
import { variables } from './_config/scripts/variables';
import router from './router';

/* Set Express app */
const app = express();

/* Set CORS origin */
app.use(cors({ origin: variables.corsOrigin }));
app.use('/', router);

/* HEY! LISTEN!! */
app.listen(variables.port, () => {
	console.log(`🏃 Running in ${variables.environment} mode`);
	console.log(`⚡️ Server is running at ${variables.url}`);
});
