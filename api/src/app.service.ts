import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AppService {
  private welcome: string[] = [];

  getHello(): string {
    return this.welcome.join(", ");
  }

  postHello(): void {
    Logger.log("Adding a new welcome message to the list.");

    this.welcome.push("Hello from NestJS!" + new Date().toISOString());
  }
}
