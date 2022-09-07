// import { createClient } from "redis";
import redisClient from "./redisClient.js";
import express from "express";
const app = express();
const PORT = 3000;

// serve static files from public directory
app.use(express.static("public"));

// initialize values
// redisClient.mSet("header", 0, "left", 0, "article", 0, "right", 0, "footer", 0);
try {
  await redisClient.set("header", 0);
  await redisClient.set("left", 0);
  await redisClient.set("article", 0);
  await redisClient.set("right", 0);
  await redisClient.set("footer", 0);

  const val = await redisClient.mGet([
    "header",
    "left",
    "article",
    "right",
    "footer",
  ]);
  console.log(val);
} catch (err) {
  console.log(`ERROR: ${err}`);
}

function data() {
  return new Promise((resolve, reject) => {
    try {
      let arr;
      const vals = new Promise((resolve, reject) => {
        resolve(
          redisClient.mGet(["header", "left", "article", "right", "footer"])
        );
      });
      console.log("vals", vals);

      vals
        .then((val) => {
          arr = val;
        })
        .then((val) => {
          console.log("arr", arr);
          console.log("val", val); // undefined

          const data = {
            header: Number(arr[0]),
            left: Number(arr[1]),
            article: Number(arr[2]),
            right: Number(arr[3]),
            footer: Number(arr[4]),
          };
          console.log("data", data);
          // err ? reject(null) : resolve(data);
          resolve(data);
        });
    } catch (err) {
      console.log("FAILED / REJECTED");
      reject(null);
    }
  });
}

// get key data
app.get("/data", (req, res) => {
  data().then((data) => {
    console.log(data);
    res.send(data);
  });
});

// Update a value
app.get("/update/:key/:value", async (req, res) => {
  const key = req.params.key;
  let value = Number(req.params.value);
  const keyVal = await redisClient.get(key);
  value = Number(keyVal) + value;
  await redisClient.set(key, value);
  // return data to client
  data().then((data) => {
    console.log(data);
    res.send(data);
  });

  // redisClient.get(key, function (err, reply) {
  //   // new value
  //   value = Number(reply) + value;
  //   redisClient.set(key, value);

  //   // return data to client
  //   data().then((data) => {
  //     console.log(data);
  //     res.send(data);
  //   });
  // });
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

// process.on("exit", function () {
//   redisClient.quit();
// });
