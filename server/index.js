const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const keys = require("./keys");

console.log(keys);

/**
 * Setup express
 */
const app = express();
app.use(cors());
app.use(bodyParser.json());

/**
 * Setup postgresql
 */

const { Pool } = require("pg");

const pgClient = new Pool({
  host: keys.pgHost,
  port: keys.pgPort,
  database: keys.pgDb,
  user: keys.pgUser,
  password: keys.pgPassword,
});

pgClient.on("error", () => {
  console.log("PG lost connection");
});

pgClient
  .query("CREATE TABLE IF NOT EXISTS values (number INT)")
  .catch((error) => {
    console.log(error);
  });

/**
 * Setup redis
 */
const redis = require("redis");

const redisClient = redis.createClient({
  port: keys.redisPort,
  host: keys.redisHost,
  retry_strategy: () => 1000,
});

const redisPublisher = redisClient.duplicate();

app.get("/", function (req, res) {
  res.send("Hi!");
});

app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * FROM values");

  res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
  redisClient.hgetall("values", (err, values) => {
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  const index = req.body.value;

  if (parseInt(index) > 40) {
    res.status(422).send("Index is too high.");
  }

  redisClient.hset("values", index, "Nothing yet!");
  redisPublisher.publish("insert", index);

  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  res.send({
    working: true
  })
});

app.listen(5000, () => {
  console.log("listening in 5000 "); 
});
