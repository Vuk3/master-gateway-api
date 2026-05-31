import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PythonService } from '../services/python.service';

@Controller('python')
export class PythonController {
  constructor(private readonly pythonService: PythonService) {}

  @Get('health')
  health() {
    return this.pythonService.health();
  }

  @Post('predict')
  @UseInterceptors(FileInterceptor('file'))
  predict(@UploadedFile() file: Express.Multer.File) {
    return this.pythonService.predict(file);
  }
}
