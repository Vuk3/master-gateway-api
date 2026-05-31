type ServiceName = 'python' | 'dotnet';

const serviceLabels = {
  python: {
    model: 'yolov8',
    service: 'python-api',
    primaryLabel: 'person',
    secondaryLabel: 'laptop',
    tertiaryLabel: 'monitor',
  },
  dotnet: {
    model: 'mlnet',
    service: 'dotnet-api',
    primaryLabel: 'chair',
    secondaryLabel: 'keyboard',
    tertiaryLabel: 'bottle',
  },
} as const;

export function createDummyPrediction(
  serviceName: ServiceName,
  file: Express.Multer.File,
) {
  const labels = serviceLabels[serviceName];

  return {
    dummy: true,
    service: labels.service,
    model: labels.model,
    file: {
      name: file?.originalname ?? 'mock-image.jpg',
      mimeType: file?.mimetype ?? 'image/jpeg',
      size: file?.size ?? 0,
    },
    imageWidth: 640,
    imageHeight: 640,
    detections: [
      {
        label: labels.primaryLabel,
        score: 0.94,
        box: {
          x1: 118,
          y1: 86,
          x2: 272,
          y2: 562,
        },
      },
      {
        label: labels.secondaryLabel,
        score: 0.87,
        box: {
          x1: 296,
          y1: 246,
          x2: 496,
          y2: 514,
        },
      },
      {
        label: labels.tertiaryLabel,
        score: 0.79,
        box: {
          x1: 502,
          y1: 160,
          x2: 586,
          y2: 396,
        },
      },
    ],
  };
}
