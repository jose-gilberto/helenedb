import http from 'http';
import { Request, RequestType } from './sockets/web/Request';
import { Response, ResponseCode } from './sockets/web/Response';

export default class StartUp {
  public static run(): void {
    StartUp.runWebServer();
  }

  // private static runTCPServer(): void {}

  private static runWebServer(): void {
    // TODO: implement recognize env variables
    const [HOST, PORT] = ['localhost', 8083];

    const requestListener: http.RequestListener = (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      switch (req.method) {
        case 'POST': {
          let body = '';

          req.on('data', (data) => {
            body += data;

            if (body.length > 1e6) req.connection.destroy();
          });

          req.on('end', () => {
            // TODO: Handle errors

            const data: Request = JSON.parse(body);
            res.writeHead(ResponseCode.Ok);

            const response: Response = {
              message: 'Message',
              code: ResponseCode.Ok,
              data: {},
              request: {
                query: data.query,
                type: RequestType.ExplainQuery,
              },
            };

            res.end(JSON.stringify(response));
          });

          break;
        }
        default:
          res.writeHead(ResponseCode.Error);
          res.end(`{
            "message": "Method not allowed",
            "code": 400,
            "data": {}
          }`);
          break;
      }
    };

    const server = http.createServer(requestListener);
    server.listen(PORT, HOST, () => {
      console.log(`Server listening at port ${PORT}`);
    });
  }
}
