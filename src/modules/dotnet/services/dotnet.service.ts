import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { firstValueFrom } from 'rxjs';
import { ConfigurationService } from '../../../configuration/services/configuration.service';

type ModelSummary = {
  id: string;
  name: string;
  family: string;
  annotationType: string;
  isDefault: boolean;
};

type ModelsResponse = {
  models: ModelSummary[];
  defaultModelId: string | null;
};

@Injectable()
export class DotnetService implements OnModuleInit {
  private readonly logger = new Logger(DotnetService.name);
  private readonly serviceUrl: string;
  private readonly requestTimeoutMs: number;
  private availableModels: ModelSummary[] = [];
  private defaultModelId: string | null = null;

  constructor(
    private readonly httpService: HttpService,
    private readonly configurationService: ConfigurationService,
  ) {
    this.serviceUrl = this.normalizeServiceUrl(
      this.configurationService.get('DOTNET_API_BASE_URL'),
    );
    this.requestTimeoutMs = this.configurationService.get(
      'SERVICE_REQUEST_TIMEOUT_MS',
    );
  }

  async onModuleInit() {
    await this.refreshModels();
  }

  async getModels() {
    if (!this.availableModels.length) {
      await this.refreshModels();
    }

    return {
      models: this.availableModels,
      defaultModelId: this.defaultModelId,
    };
  }

  async predict(file: Express.Multer.File, modelId?: string) {
    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    if (modelId) {
      formData.append('model', modelId);
    }

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

  private async refreshModels() {
    try {
      const response = await firstValueFrom(
        this.httpService.get<ModelsResponse>(`${this.serviceUrl}/models`, {
          timeout: this.requestTimeoutMs,
        }),
      );

      this.availableModels = response.data.models ?? [];
      this.defaultModelId = response.data.defaultModelId ?? null;

      this.logger.log(
        `Loaded ${this.availableModels.length} .NET model entries`,
      );
    } catch (error) {
      this.logRequestError(error);
      this.availableModels = [];
      this.defaultModelId = null;
    }
  }

  private logRequestError(error: unknown) {
    if (axios.isAxiosError(error)) {
      this.logger.error(
        `.NET request failed with status ${error.response?.status ?? 'unknown'} (${error.code ?? 'no-code'})`,
        JSON.stringify(error.response?.data ?? error.message),
      );

      return;
    }

    this.logger.error('.NET request failed', String(error));
  }
}
