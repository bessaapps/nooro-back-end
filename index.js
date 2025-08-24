require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
let cors = require("cors");
const port = process.env.PORT || 3000;
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.post("/tasks", async (req, res) => {
  const { body } = req;

  const task = await prisma.task.create({
    data: { ...body }
  });

  res.json(task?.id);
});

app.get("/tasks", async (req, res) => {
  const tasks = await prisma.task.findMany();

  res.json(tasks);
});

app.patch("/tasks", async (req, res) => {
  const { body } = req;

  const updateData = { ...body };
  delete updateData.id;

  await prisma.task.update({
    where: {
      id: body.id
    },
    data: {
      ...updateData
    }
  });

  res.send("Good things come to those who wait!");
});

app.delete("/tasks/:id", async (req, res) => {
  await prisma.task.deleteMany({ where: { id: parseInt(req.params?.id) } });

  res.send("Good things come to those who wait!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
