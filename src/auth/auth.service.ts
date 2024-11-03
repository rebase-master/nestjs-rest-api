import {ForbiddenException, Injectable} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}
    async signup(dto: AuthDto) {
        const hash = await argon.hash(dto.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                },
                // Helps in selecting the desired attributes from the DB
                // select: {
                //     id: true,
                //     email: true,
                //     createdAt: true
                // }
            });
            delete user.hash // dirtry hack to delete user hash attribute
            return user;
        } catch(error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if(error.code === 'P2002') {
                    throw new ForbiddenException(
                      'Credentials taken',
                      );
                }
            }
            throw error;
        }
    }
    async signin(dto: AuthDto) {
        // find the user by email
        // the findUnique() method is used to fetch
        // a single row from the User table
        const user =
            await this.prisma.user.findUnique({
             where: {
              email: dto.email,
             }
            });

        //if user does not exist throw exception
        if(!user) {
            throw new ForbiddenException(
              'Credentials incorrect'
            );
        }
        //compare password
        const passwordMatches = await argon.verify(
          user.hash,
          dto.password
        )
        // if password is incorrect, throw exception
        if(!passwordMatches) {
            throw new ForbiddenException(
              'Credentials incorrect'
            );
        }
        //send back the user
        delete user.hash
        return user;
    }
}
