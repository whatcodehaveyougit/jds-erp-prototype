import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  private welcome: string[] = [];

  getHello(): string {
    return this.welcome.join(", ");
  }

  postHello(): void {
    this.welcome.push("Hello from NestJS!" + new Date().toISOString());
  }
}
