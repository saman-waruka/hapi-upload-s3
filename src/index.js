"use strict";

const Hapi = require("@hapi/hapi");

const { upload } = require("./helper/s3upload");
// const upload = require("./file-upload");

const init = async () => {
  const server = Hapi.server({
    port: 4000,
    host: "localhost",
    routes: {
      cors: true
    }
  });

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      console.log(" Hell");
      return "Hello World!";
    }
  });

  server.route({
    method: "POST",
    path: "/upload",
    options: {
      handler: async (request, h) => {
        // console.log(" Upload Called", request);

        let responseFile = null;
        await upload(request.payload.file, request.payload.name)
          .then(resp => {
            console.log(" Respons ====> ", resp);
            responseFile = { fileUrl: resp.Location };
          })
          .catch(err => {
            responseFile = err.message;
          });
        return responseFile;
      },
      payload: {
        // output: "stream",
        // parse: true,
        // allow: "multipart/form-data"
        // maxBytes: 1024 * 1024 * 100,
        // timeout: false
        output: "stream",
        parse: true,
        multipart: true
      }
    }
  });

  server.events.on("response", function(request) {
    console.log(
      request.info.remoteAddress +
        ": " +
        request.method.toUpperCase() +
        " " +
        request.path +
        " --> " +
        request.response.statusCode
    );
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
