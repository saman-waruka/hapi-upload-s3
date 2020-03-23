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
    method: "GET",
    path: "/foodlist",
    handler: (request, h) => {
      console.log(" Hell");
      return "Hello World!";
    }
  });

  server.route({
    method: "PUT",
    path: "/upload",
    options: {
      handler: async (request, h) => {
        // console.log(" Upload Called", request.payload);
        const { description, symptom, treatment, file, name } = request.payload;
        console.log(" request.payload ====> ", request.payload);
        console.log(" File ====> ", file);
        let response = {};
        let responseFile = null;
        console.log("detail", description, symptom, treatment);
        try {
          if (file) {
            await upload(file, name)
              .then(resp => {
                console.log(" Respons ====> ", resp);
                responseFile = { fileUrl: resp.Location };
                response.fileUrl = resp.Location;
              })
              .catch(err => {
                responseFile = err.message;
              });
          }
          if (description) {
            response.description = description;
          }
          if (symptom) {
            response.symptom = symptom;
          }
          if (treatment) {
            response.treatment = treatment;
          }
          return response;
        } catch (err) {
          console.log(" error ====> ", err);
        }
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
