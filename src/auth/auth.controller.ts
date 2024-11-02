import {Controller, Post, Body, ParseIntPipe} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {AuthDto} from "./dto";

@Controller('auth')
export class AuthController{
    constructor(private authservice: AuthService) {}

    // POST /auth/signup
    @Post('signup')
    signup(
      @Body('email') email: string,
      @Body('password', ParseIntPipe) password: string
    ) {
        console.log({
            email,
            typeOfEmail: typeof email,
            password,
            typeOfPassword: typeof password
        })
        return this.authservice.signup();
    }

    // POST /auth/signin
    @Post('signin')
    signin(){
        return this.authservice.signin()
    }

}