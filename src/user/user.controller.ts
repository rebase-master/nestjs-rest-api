import {
	Controller,
	Get,
	Req,
	UseGuards
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
	@Get('me')
	getMe(@GetUser('id') user: User) {
		return user;
	}
}
