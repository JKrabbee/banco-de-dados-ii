import { Router } from "express";
import { LikeController } from "../controllers";
import { Auth, ValidarFormatoId } from "../middlewares";

export function likeRoutes() {
  const router = Router();
  const controller = new LikeController();
  const validarFormatoId = new ValidarFormatoId();
  const auth = new Auth();

  //CRIAR
  router.post(
    "/:id",
    [auth.validar, validarFormatoId.validar],
    controller.criar
  );

  //DELETAR
  router.delete(
    "/:id",
    [auth.validar, validarFormatoId.validar],
    controller.deletar
  );

  return router;
}
