import { injectable, Container } from "inversify";
import { interfaces, InversifyExpressServer, TYPE } from "inversify-express-utils";
import "reflect-metadata";
import TYPES from "./constants/types";
import TAGS from "./constants/tags";
import { UserController } from "./controllers/user-controller";
import { UserService } from "./services/user-service";
import { AuthorizationController } from "./controllers/authorization-controller";
import { AuthorizationService } from "./services/authorization-service";


@injectable()
export default class Routes {

  constructor() {

  }

  public setup(container: Container) {

    container.bind<interfaces.Controller>(TYPE.Controller).to(UserController).whenTargetNamed(TAGS.UserController);
    container.bind<UserService>(TYPES.UserService).to(UserService);

    container.bind<interfaces.Controller>(TYPE.Controller).to(AuthorizationController).whenTargetNamed(TAGS.AuthorizationController);
    container.bind<AuthorizationService>(TYPES.AuthorizationService).to(AuthorizationService);

  }

}
