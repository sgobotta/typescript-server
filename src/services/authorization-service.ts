import { inject, injectable } from "inversify";
import { MongoDBClient } from "../config/mongodb/client";
import TYPES from "./../constants/types";
import { User, UserBuilder, Session, SessionBuilder } from "../models/user";
import { Wove } from "aspect.js";

@Wove()
@injectable()
export class AuthorizationService {

  private mongoClient: MongoDBClient;
  private collection: string;

  constructor(
    @inject(TYPES.MongoDBClient) mongoClient: MongoDBClient,
  ) {
    this.mongoClient = mongoClient;
    this.collection = "users";
  }

  public login(email: string, password: string): Promise<LoginResponse> {
    return new Promise<LoginResponse>((resolve, reject) => {
      this.mongoClient.findOneByProperty(this.collection, { email: email}, (error, user: User) => {
        if (user) {
          let newUser;
          try {
            newUser = new UserBuilder()
              .withEmail(user.email)
              .withPassword(user.password)
              .withPasswordRepeat(user.password)
              .withSession(user.email)
              .build();
            newUser.passwordMatch(password);
            this.resetToken(user.email)
              .then((response) => {
                resolve({ success: true, session: response.session, user: user });
              })
              .catch((response) => {
                reject({ success: false, msg: response });
              });
          }
          catch (err) {
            reject({ success: false, msg: err });
          }
        }
      })
    })
  }

  public logout(email: string): Promise<LogoutResponse> {
    return new Promise<LogoutResponse>((resolve, reject) => {
      this.mongoClient.findOneByProperty(this.collection, { email: email }, (error, user: User) => {
        if (user) {
          let newUser;
          try {
            newUser = new UserBuilder()
              .withEmail(user.email)
              .withPassword(user.password)
              .withPasswordRepeat(user.password)
              .withSession(user.email)
              .build();
            this.destroySession(newUser)
              .then((response) => {
                resolve({ success: true });
              })
              .catch((response) => {
                reject({ success: false, msg: response });
              });
          }
          catch (err) {
            reject({ success: false, msg: err });
          }
        }
      })
    })
  }

  private resetToken(email: string): Promise<TokenResetResponse> {
    return new Promise<TokenResetResponse>((resolve, reject) => {
      const session = new SessionBuilder()
        .withToken(email)
        .withExpireDate()
        .build();
      this.mongoClient.updateByProperty(this.collection, { email: email }, { session: session }, (err, res) => {
        if (err) reject(err.msg);
        if (res) resolve({ session: session });
      });
    });
  }

  private destroySession(user: User): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
      const now = new Date();
      const newDate = now.setHours(now.getHours() - 12);
      this.mongoClient.updateByProperty(
        this.collection,
        { email: user.email },
        { session: { token: "", expireDate: "" } },
        (err, res) => {
          if (err) reject(err);
          if (res) resolve(true);
        });
    });
  }
}

export interface LoginResponse {
  success: boolean;
  session: Session;
  user: User;
}

export interface TokenResetResponse {
  session: Session;
}

export interface LogoutResponse {
  success: boolean;
}
