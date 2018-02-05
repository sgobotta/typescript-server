import {
  controller, httpGet, httpPost, httpPut, httpDelete
} from "inversify-express-utils";
import { injectable, inject } from "inversify";
import { AuthorizationService, LoginResponse, LogoutResponse } from "../services/authorization-service";
import { Request, Response } from "express";
import TYPES from "../constants/types";


@injectable()
@controller("/authorization")
export class AuthorizationController {

  constructor(@inject(TYPES.AuthorizationService) private authorizationService: AuthorizationService) {}

  @httpPost("/:email")
  public login(request: Request): Promise<LoginResponse> {
    return this.authorizationService.login(request.params.email, request.body.password)
      .then((response) => response)
      .catch((response) => response);
  }

  @httpGet("/:email")
  public logout(request: Request): Promise<LogoutResponse> {
    return this.authorizationService.logout(request.params.email)
      .then((response) => response)
      .catch((response) => response);
  }
}
