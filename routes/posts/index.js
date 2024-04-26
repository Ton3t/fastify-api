"use strict";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async function (fastify, opts) {
  // recibir todos los posts
  fastify.get("/", async function (request, reply) {
    try {
      const posts = await prisma.post.findMany();
      if (!posts || posts.length === 0) {
        return reply.status(400).send("No hay Posts.");
      }
      reply.status(200).send(posts);
    } catch (error) {
      reply.status(500).send({ errorMessage: "Error en el servidor", error });
    }
  });

  // recibir un solo post
  fastify.get("/:id", async function (request, reply) {
    try {
      const postId = await prisma.post.findUnique({
        where: {
          id: parseInt(request.params.id),
        },
      });

      if (!postId) {
        return reply
          .status(400)
          .send(
            "No existe el Post con ese id. Porfavor si tiene algún problema contacte con algún programador."
          );
      }

      reply.status(200).send(postId);
    } catch (error) {
      reply.status(500).send({ errorMessage: "Error del servidor", error });
    }
  });

  // crear un nuevo post
  fastify.post("/", async function (request, reply) {
    try {
      const newPost = await prisma.post.create({
        data: request.body,
      });

      reply.status(200).send(newPost);
    } catch (error) {
      reply.status(500).send({ errorMessage: "Error del servidor", error });
    }
  });

  // eliminar un post
  fastify.delete("/:id", async function (request, reply) {
    try {
      const postId = await prisma.post.findUnique({
        where: {
          id: parseInt(request.params.id),
        },
      });

      if (!postId) {
        return reply.status(400).send("No existe el Post con ese id");
      }

      const postDelete = await prisma.post.delete({
        where: {
          id: postId,
        },
      });

      reply.status(200).send(postDelete);
    } catch (error) {
      reply.status(500).send({ errorMessage: "Error del servidor", error });
    }
  });

  // modificar posts
  fastify.put("/:id", async function (request, reply) {
    try {
      const postId = await prisma.post.findUnique({
        where: {
          id: parseInt(request.params.id),
        },
      });

      if (!postId) {
        return reply.status(400).send("No existe el Post con ese id");
      }

      const postUpdate = await prisma.post.update({
        where: {
          id: postId,
        },
        data: request.body,
      });

      reply.status(200).send(postUpdate);
    } catch (error) {
      reply.status(500).send({ errorMessage: "Error del servidor", error });
    }
  });
};
