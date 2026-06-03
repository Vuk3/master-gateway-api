import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { firstValueFrom } from 'rxjs';
import { ConfigurationService } from '../../../configuration/services/configuration.service';
import { createDummyPrediction } from '../../shared/dummy-prediction';

@Injectable()
export class PythonService {
  private readonly logger = new Logger(PythonService.name);
  private readonly serviceUrl: string;
  private readonly requestTimeoutMs: number;
  private readonly useDummyPredictions: boolean;

  constructor(
    private readonly httpService: HttpService,
    private readonly configurationService: ConfigurationService,
  ) {
    this.serviceUrl = this.normalizeServiceUrl(
      this.configurationService.get('PYTHON_API_BASE_URL'),
    );
    this.requestTimeoutMs = this.configurationService.get(
      'SERVICE_REQUEST_TIMEOUT_MS',
    );
    this.useDummyPredictions = this.configurationService.get(
      'USE_DUMMY_PREDICTIONS',
    );
  }

  async predict(file: Express.Multer.File) {
    if (this.useDummyPredictions) {
      return createDummyPrediction('python', file);
    }

    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.serviceUrl}/predict`, formData, {
          headers: formData.getHeaders(),
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          timeout: this.requestTimeoutMs,
        }),
      );

      return response.data;
    } catch (error) {
      this.logRequestError(error);
      throw error;
    }
  }

  async health() {
    const response = await firstValueFrom(
      this.httpService.get(`${this.serviceUrl}/health`, {
        timeout: this.requestTimeoutMs,
      }),
    );

    return response.data;
  }

  private normalizeServiceUrl(serviceUrl: string) {
    return serviceUrl.replace(/\/+$/, '');
  }

  private logRequestError(error: unknown) {
    if (axios.isAxiosError(error)) {
      this.logger.error(
        `Python request failed with status ${error.response?.status ?? 'unknown'} (${error.code ?? 'no-code'})`,
        JSON.stringify(error.response?.data ?? error.message),
      );

      return;
    }

    this.logger.error('Python request failed', String(error));
  }
}
