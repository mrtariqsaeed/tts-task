const functions = require("firebase-functions");
const cors = require("cors")({origin: true});
const mysql = require("mysql");
const {info, error} = require("firebase-functions/lib/logger");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.getHotel = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const pool = mysql.createPool({
      socketPath: "/cloudsql/tts-task:us-central1:ttsdb",
      user: "root",
      password: "ttsdbpass",
      database: "tts",
    });

    pool.getConnection((errr, connection) => {
      if (errr) {
        error("Could not get connection!");
        response.send(errr);
      }

      info("Database Connected!");

      connection.query("SELECT * from hotel", (err, results, fields) => {
        connection.release();
        if (err) {
          error("Query Failed!");
          pool.end();
          response.send(err);
        }
        info("Query Response -> ", results);
        response.send(results);
      });
    });
  });
});

exports.getReport = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    if (request.body) {
      const reqBody = request.body;
      info("Report parameters ->", reqBody);
      if (reqBody.fromDate && reqBody.toDate && reqBody.hotelID) {
        const pool = mysql.createPool({
          socketPath: "/cloudsql/tts-task:us-central1:ttsdb",
          user: "root",
          password: "ttsdbpass",
          database: "tts",
        });

        pool.getConnection((errr, connection) => {
          if (errr) {
            error("Could not get connection!");
            response.send(errr);
          }

          info("Database Connected!");
          let query = "SELECT * from review ";
          query += `WHERE create_date > '${reqBody.fromDate}' `;
          query += `and create_date < '${reqBody.toDate}' `;
          query += `and hotel_id = ${reqBody.hotelID}`;
          connection.query(
              query,
              (err, results, fields) => {
                connection.release();
                if (err) {
                  error("Query Failed!");
                  pool.end();
                  response.send(err);
                }
                info("Query Response -> ", results);
                response.send(results);
              }
          );
        });
      } else {
        response.status(403).send("Missing some request parameters!");
      }
    } else {
      response.status(403).send("Missing all request parameters!");
    }
  });
});
