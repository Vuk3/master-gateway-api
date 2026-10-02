# Object Detection Gateway

The NestJS gateway of my master's thesis, a system that runs the same image through a
YOLOv8m model in Python and an ML.NET model in .NET and compares the two. The frontend knows
only this address. The gateway forwards each upload to the Python or the .NET service and
passes the answer back, which leaves the two ML services free to change without the client
noticing.

The full write-up, with the results: [vukcvetkovic.com/projects/object-detection](https://vukcvetkovic.com/projects/object-detection/)

## The system

| Repository | Role |
| --- | --- |
| [master-frontend](https://github.com/Vuk3/master-frontend) | React dashboard: sends an image, draws both results side by side |
| **master-gateway-api** | NestJS gateway, the one address the frontend calls |
| [master-python-api](https://github.com/Vuk3/master-python-api) | FastAPI service running the YOLOv8m models |
| [master-dotnet-api](https://github.com/Vuk3/master-dotnet-api) | ASP.NET Core service running the ML.NET models |

```
frontend  ->  gateway  ->  python-api   YOLOv8m, port 8123
                       ->  dotnet-api   ML.NET, port 7146
```

## Endpoints

| Method | Path | Returns |
| --- | --- | --- |
| `GET` | `/health` | The gateway's own health check |
| `GET` | `/python/health`, `/dotnet/health` | Each service's health check, passed through |
| `GET` | `/python/models`, `/dotnet/models` | The models a service can run, and its default |
| `POST` | `/python/predict`, `/dotnet/predict` | The detections for one image |

`predict` takes `multipart/form-data`: `file` is the image, and `model` is an optional id from
the matching `/models` list. Without it the service uses its default model.

Both services answer in one format, which is what lets a single frontend draw either result:

```json
{
  "model": "YOLOv8m",
  "modelId": "fully-annotated/yolov8m_800_e50_best.pt",
  "annotationType": "fully-annotated",
  "imageWidth": 1920,
  "imageHeight": 1080,
  "detections": [
    {
      "label": "Helmet",
      "score": 0.93,
      "box": { "x1": 812.4, "y1": 140.2, "x2": 918.7, "y2": 236.5 }
    }
  ],
  "fileName": "site.jpg",
  "contentType": "image/jpeg"
}
```

## How it works

- **Configuration is checked at startup.** Every variable below is validated with
  class-validator, and a missing or malformed one stops the gateway before it takes a request.
- **Model catalogs are fetched once.** Each service's `/models` is read when the gateway starts
  and kept in memory. If a service was down at that moment, its catalog is fetched again on the
  next request for it.
- **Uploads stay in memory.** The image is held as a buffer and sent on as a new multipart body,
  so nothing is written to disk on the way through.
- **Every call to a service has a timeout**, and a failed call is logged with its HTTP status
  and its axios error code before the error goes back to the client.

## Configuration

Copy `.env.example` to `.env`.

| Variable | In `.env.example` | Meaning |
| --- | --- | --- |
| `PORT` | `3000` | Port the gateway listens on |
| `CORS_ORIGINS` | `http://localhost:5173` | Origins allowed to call it, comma-separated |
| `PYTHON_API_BASE_URL` | `http://localhost:8123` | The Python service |
| `DOTNET_API_BASE_URL` | `http://localhost:7146` | The .NET service |
| `SERVICE_REQUEST_TIMEOUT_MS` | `60000` | Timeout for each call to a service, in milliseconds |

## Running it

Node 20 and Yarn:

```bash
yarn install
cp .env.example .env
yarn start:dev
```

The gateway starts even when a service is down: that service's catalog stays empty until a
later request finds it up.
