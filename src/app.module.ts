import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigurationModule } from './configuration/configuration.module';
import { DotnetModule } from './modules/dotnet/dotnet.module';
import { PythonModule } from './modules/python/python.module';

@Module({
  imports: [ConfigurationModule, DotnetModule, PythonModule],
  controllers: [AppController],
})
export class AppModule {}
