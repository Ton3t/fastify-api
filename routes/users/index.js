"use strict";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async function (fastify, opts) {
  // todos los usuarios
  fastify.get("/", async function (request, reply) {
    try {
      const users = await prisma.user.findMany();
      if (!users || users.length === 0) {
        return reply.status(200).send("No hay usuarios");
      }
      reply.status(200).send(users);
    } catch (error) {
      reply.status(500).send({ errorMessage: "error en el servidor", error });
    }
  });

  // un solo usuario

  fastify.get("/:id", async function (request, reply) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: parseInt(request.params.id),
        },
      });

      if (!user) {
        return reply
          .status(400)
          .send("No existe el id. Porfavor contacte con un programador.");
      }

      reply.status(200).send(user);
    } catch (error) {
      reply.status(500).send({ errorMessage: "error en el servidor", error });
    }
  });

  // insertar usuarios

  fastify.post("/", async function (request, reply) {
    try {
      const email = await prisma.user.findUnique({
        where: {
          email: request.body.email,
        },
      });

      if (email) {
        return reply
          .status(400)
          .send({ errorMessage: "El email ya está registrado." });
      }

      const newUser = await prisma.user.createMany({
        data: request.body,
      });

      reply.status(200).send(newUser);
    } catch (error) {
      reply.status(500).send({ errorMessage: "error en el servidor", error });
    }
  });

  // eliminar usuarios

  fastify.delete("/:id", async function (request, reply) {
    const userId = request.params.id;

    if (!userId) {
      return reply.status(400).send({ errorMessage: "No existe el id." });
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          id: parseInt(userId, 10),
        },
      });

      if (!user?.id) {
        return reply
          .status(404)
          .send({ errorMessage: "No se encuentra este usuario." });
      }

      

      const deletedUser = await prisma.user.delete({
        where: {
          id: parseInt(userId, 10),
        },
      });

      reply.status(200).send({ user: deletedUser });
    } catch (error) {
      console.log(error);
      reply.status(500).send({ errorMessage: "error en el servidor", error });
    }
  });

  // modificar usuario

  fastify.put("/:id", async (req, reply) => {
    try {
      const userId = await prisma.user.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (!userId) {
        return reply.status(400).send("No hay usuarios");
      }

      const userUpdate = await prisma.user.update({
        where: {
          id: userId,
        },
        data: req.body,
      });

      reply.status(200).send(userUpdate);
    } catch (error) {
      reply.status(500).send({ errorMessage: "error en el servidor", error });
    }
  });
};
