import {
  Body,
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

  @Get('models')
  models() {
    return this.dotnetService.getModels();
  }

  @Post('predict')
  @UseInterceptors(FileInterceptor('file'))
  predict(
    @UploadedFile() file: Express.Multer.File,
    @Body('model') modelId?: string,
  ) {
    return this.dotnetService.predict(file, modelId);
  }
}
