import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as FormData from 'form-data';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  async predictWithMLNet(file: Express.Multer.File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    const response = await this.httpService
      .post('http://localhost:7146/predict', formData, {
        headers: formData.getHeaders(),
      })
      .toPromise();

    return response.data;
  }

  async predictWithPython(file: Express.Multer.File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    const response = await this.httpService
      .post('http://localhost:5002/predict', formData, {
        headers: formData.getHeaders(),
      })
      .toPromise();

    return response.data;
  }

  async healthDOTNET(): Promise<any> {
    const response = await this.httpService
      .get('http://dotnet-api:7146/health')
      .toPromise();

    return response.data;
  }

  async healthPYTHON(): Promise<any> {
    const response = await this.httpService
      .get('http://python-api:8123/health')
      .toPromise();

    return response.data;
  }
}
