import http from 'http';
import fs from 'fs';


const PORT = process.env.PORT || 3000
http
    .createServer((request, response) => {
      // console.log('-> request', request.url, request.method, request.headers);
      // console.log(response)

      const url = request.url;
      const {method} = request;
      console.log('-> method', method);
      console.log(url)
      if (url === '/branch') {
        // response.setHeader('Content-Type', 'text/html')
        response.write('<h1>Hello Branch<h1/>');
        return response.end()
      }

      if (url === '/') {
        response.write('<body><form action="/message" method="post" ><input type="text" name="message"><button type="submit">Submit</button>')
        return response.end();
      }
      // if(method === 'GET' && url === '/message') {
      //   fs.writeFileSync('message.txt', 'DUMMY');
      //   response.statusCode = 302;
      //   response.setHeader('Location', '/branch');
      //   return response.end();
      // }
      if (method === 'POST' && url === '/message') {
        const body: string[] = [];
        request.on('data', (chunk) => {
          console.log('chunk', chunk)
          body.push(chunk);
        })
        request.on('end', () => {
          // @ts-ignore
          const parsedBody = Buffer.concat(body).toString();
          console.log('-> parsedBody', parsedBody);
          const message = parsedBody.split('=')[1];
          fs.writeFile('message.txt', message, (err) => {
            response.statusCode = 302;
            response.setHeader('Location', '/branch');
            return response.end()

          });
        })
      }

      // response.setHeader('Content-Type', 'text/html')
      response.write('<h1>Hello NodeJs<h1/>');
      response.end()
    })
    .listen(PORT, () => {
      console.log(' Create server on port 3000 ')
    })

