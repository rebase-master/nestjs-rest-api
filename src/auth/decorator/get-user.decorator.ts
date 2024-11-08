import {
	createParamDecorator,
	ExecutionContext
} from '@nestjs/common';
import { Express } from "express";

export const GetUser = createParamDecorator(
	(
		data: string | undefined,
		ctx: ExecutionContext,
	) => {
		const request: Express.Request = ctx
			.switchToHttp()
			.getRequest();
		if (request && data !== undefined) {
			return request.user[data];
		}
		return request.user;
	},
);