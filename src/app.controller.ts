import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';

@Controller('predict')
export class AppController {
  constructor(private readonly apiService: AppService) {}

  @Post('mlnet')
  @UseInterceptors(FileInterceptor('file'))
  async predictWithMLNet(@UploadedFile() file: Express.Multer.File) {
    return this.apiService.predictWithMLNet(file);
  }

  @Post('python')
  @UseInterceptors(FileInterceptor('file'))
  async predictWithPython(@UploadedFile() file: Express.Multer.File) {
    return this.apiService.predictWithPython(file);
  }

  @Get('health')
  health() {
    return 'Ok from NEST';
  }

  @Get('healthDOTNET')
  healthDOTNET() {
    return this.apiService.healthDOTNET();
  }

  @Get('healthPYTHON')
  healthPYTHON() {
    return this.apiService.healthPYTHON();
  }
}
