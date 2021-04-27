import { Req } from "@tsed/common";
import { Unauthorized } from "@tsed/exceptions";
import { Arg, OnVerify, Protocol } from "@tsed/passport";
import { Description, Required } from "@tsed/schema";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { config } from "src/config/env";
import { UserService } from "src/services/users/UserService";


export class JwtPayload{
    @Required()
    @Description("The JWT's issuer")
    iss: string;

    @Required()
    @Description("The JWT's audience")
    aud: string;

    @Required()
    @Description("The JWT's subject (user id)")
    sub: string;

    @Required()
    @Description("The JWT's expiry date in unix/epoch time")
    exp: string;

    @Required()
    @Description("The JWT's issuance date in unix/epoch time")
    iat: string;
}

@Protocol<StrategyOptions>({
    name: "jwt",
    useStrategy: Strategy,
    settings: {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config["JWT_SECRET"],
        issuer: "accounts.examplesoft.com",
        audience: "yoursite.net"
    }
})
export class JwtProtocol implements OnVerify {
    constructor(private userService: UserService) {
    }

    async $onVerify(@Req() req: Req, @Arg(0) jwtPayload: JwtPayload) {
        const user = await this.userService.findById(jwtPayload.sub);

        if (!user) {
            throw new Unauthorized("Wrong token");
        }

        return user ? user : false;
    }
}