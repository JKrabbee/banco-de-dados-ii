import { Router } from "express";
import { TweetController } from "../controllers/tweet.controller";
import { Auth, ValidarFormatoId, VerificarIdUsuario } from "../middlewares";

export function tweetRoutes() {
  const router = Router();
  const controller = new TweetController();
  const validarFormatoId = new ValidarFormatoId();
  const verificarIdUsuario = new VerificarIdUsuario();
  const auth = new Auth();

  //CRIAR
  router.post(
    "/:id",
    [auth.validar, validarFormatoId.validar, verificarIdUsuario.validar],
    controller.criar
  );

  //LISTAR TODOS
  router.get("/", [auth.validar], controller.listar);

  //LISTAR POR ID
  router.get(
    "/:id",
    [auth.validar, validarFormatoId.validar],
    controller.listPorID
  );

  //ATUALIZAR
  router.put(
    "/:id",
    [auth.validar, validarFormatoId.validar, verificarIdUsuario.validar],
    controller.atualizar
  );

  //DELETAR
  router.delete(
    "/:id",
    [auth.validar, validarFormatoId.validar, verificarIdUsuario.validar],
    controller.deletar
  );
}
