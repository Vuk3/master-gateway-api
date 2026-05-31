import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PythonController } from './controllers/python.controller';
import { PythonService } from './services/python.service';

@Module({
  imports: [HttpModule],
  controllers: [PythonController],
  providers: [PythonService],
})
export class PythonModule {}
