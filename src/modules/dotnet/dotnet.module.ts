import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DotnetController } from './controllers/dotnet.controller';
import { DotnetService } from './services/dotnet.service';

@Module({
  imports: [HttpModule],
  controllers: [DotnetController],
  providers: [DotnetService],
})
export class DotnetModule {}
