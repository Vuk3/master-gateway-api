import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DotnetService } from '../services/dotnet.service';

@Controller('dotnet')
export class DotnetController {
  constructor(private readonly dotnetService: DotnetService) {}

  @Get('health')
  health() {
    return this.dotnetService.health();
  }

  @Post('predict')
  @UseInterceptors(FileInterceptor('file'))
  predict(@UploadedFile() file: Express.Multer.File) {
    return this.dotnetService.predict(file);
  }
}
