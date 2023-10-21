import { Router } from "express";
import { UsuarioController } from "../controllers";
import {
  Auth,
  CadastroUsuario,
  Login,
  ValidarFormatoId,
  VerificarIdUsuario,
} from "../middlewares";

export function usuarioRoutes() {
  const router = Router();
  const controller = new UsuarioController();
  const cadastrarAluno = new CadastroUsuario();
  const validarFormatoId = new ValidarFormatoId();
  const verificarIdUsuario = new VerificarIdUsuario();
  const login = new Login();
  const auth = new Auth();

  //CADASTRAR
  router.post("/", [cadastrarAluno.validar], controller.cadastrar);
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

  //LOGIN
  router.post("/login", [login.validar], controller.login);
  //LOGOUT
  router.post("/logout", [auth.validar], controller.logout);

  return router;
}
