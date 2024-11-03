import {Controller, Post, Body} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {AuthDto} from "./dto";

@Controller('auth')
export class AuthController{
    constructor(private authservice: AuthService) {}

    // POST /auth/signup
    @Post('signup')
    signup(@Body() dto: AuthDto) {

        return this.authservice.signup(dto);
    }

    // POST /auth/signin
    @Post('signin')
    signin(@Body() dto: AuthDto) {
        return this.authservice.signin(dto)
    }

}