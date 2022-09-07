import redisClient from "./redisClient.js";

// single value read & write
try {
  await redisClient.set("my_key", "Hello, Redis!");
  const reply = await redisClient.get("my_key");
  console.log(reply);
} catch (err) {
  console.log(err);
}

// multiple value read & write
try {
  await redisClient.set("header", 0);
  await redisClient.mSet("mario", 55, "luigi", 31);

  const val = await redisClient.mGet(["header", "my_key"]);
  console.log(val);

  const bval = await redisClient.get("mario");
  console.log(bval);
} catch (err) {
  console.log(err);
}

redisClient.quit();
