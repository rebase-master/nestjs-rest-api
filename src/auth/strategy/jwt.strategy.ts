import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(
	Strategy,
	'jwt', // 'jwt' is used to identify this strategy in guard. It can be named anything.
) {
	constructor(
		config: ConfigService,
		private prisma: PrismaService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.get('JWT_SECRET'),
		});
	}

	// This method is called automatically and is used
	// for validate the received payload.
	async validate(payload: { sub: number; email: string }) {
		const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
		if (!user) throw new UnauthorizedException();   // deleted user + valid token → 401, not a TypeError
		const { hash, ...safeUser } = user;              // don't mutate the Prisma result
		return safeUser;                                 // becomes req.user
	}
}
