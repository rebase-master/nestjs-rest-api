import {Controller, Post, Body, HttpCode, HttpStatus} from "@nestjs/common";
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
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() dto: AuthDto) {
        return this.authservice.signin(dto)
    }

}