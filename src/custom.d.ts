import { Request } from 'express';
import { Context } from '../src/app';

declare module 'express-serve-static-core' {
	interface Request {
		context?: Context;
	}
}
