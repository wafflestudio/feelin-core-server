import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('/')
    public getHello() {
        return this.appService.getHello();
    }
}
