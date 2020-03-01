'use strict';

const Hapi = require('@hapi/hapi');

const upload = require("./file-upload");





const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: true
        }
    });

    // server.connection({ routes: { cors: true } })

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {

            return 'Hello World!';
        }
    });

    server.route({
        method: 'POST',
        path: '/upload',
        config: {
            handler: async (request, h) => {
                console.log( " Upload Called");
    
                let responseFile = null;
                await upload(request.payload.file).then((resp) => {
    
                    responseFile = {fileUrl: resp.Location};
                }).catch((err) => {
                    responseFile = err.message;
                });
                return responseFile;
            },
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                maxBytes: 1024 * 1024 * 100,
                timeout: false,
            }
        }
    });
    
    server.events.on('response', function (request) {
        console.log(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.path + ' --> ' + request.response.statusCode);
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();