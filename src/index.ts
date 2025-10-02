import { Elysia, status, t } from "elysia";
import { TodoPlain, TodoPlainInputCreate, TodoPlainInputUpdate } from "./generated/prismabox/Todo";
import { prisma } from "./prisma";

const app = new Elysia()
  .get(
    "/todo",
    async () => {
      const data = await prisma.todo.findMany();

      return status(200, data);
    },
    { response: { 200: t.Array(TodoPlain) } }
  )

  .delete(
    "/todo/:id",
    async ({ params }) => {
      try {
        await prisma.todo.delete({ where: { id: params.id } });
      } catch (error) {
        return status(404, "Todo introuvable");
      }

      return status(200, "Suppression effectuée");
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: {
        200: t.String(),
        404: t.String(),
      },
    }
  )

  .post(
    "/todo",
    async ({ body }) => {
      try {
        const todo = await prisma.todo.create({ data: body });
      } catch (error) {
        return status(401, "Tache non ajouté");
      }
      return status(201, "Tache bien ajouté");
    },
    {
      body: TodoPlainInputCreate,
      response: {
        201: t.String(),
        401: t.String(),
      },
    }
  )

  .put(
    "/todo/:id",
    async ({ params, body }) => {
      try {
        const todo = await prisma.todo.update({ where: { id: params.id }, data: body });
      } catch (error) {
        return status(404, "Todo introuvable");
      }
      return status(200, "Modification effectuée");
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: TodoPlainInputUpdate,
      response: { 200: t.String(), 404: t.String() },
    }
  )

  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
