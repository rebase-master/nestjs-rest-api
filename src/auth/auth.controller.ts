import {Controller, Post} from "@nestjs/common";
import {AuthService} from "./auth.service";

@Controller('auth')
export class AuthController{
    constructor(private authservice: AuthService) {}

    // POST /auth/signup
    @Post('signup')
    signup(){
        return this.authservice.signup();
    }

    // POST /auth/signin
    @Post('signin')
    signin(){
        return this.authservice.signin()
    }

}