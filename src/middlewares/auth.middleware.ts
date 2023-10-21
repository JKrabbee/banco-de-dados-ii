import { NextFunction, Request, Response } from "express";
import { UsuarioService } from "../services";

export class Auth {
  public async validar(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        code: 401,
        ok: false,
        mensagem: "Token é obrigatório",
      });
    }

    const service = new UsuarioService();
    const usuarioAutenticado = await service.validarToken(token);

    if (!usuarioAutenticado) {
      return res.status(401).json({
        code: 401,
        ok: false,
        mensagem: "Token inválido",
      });
    }

    req.body.idUsuario = usuarioAutenticado;

    return next();
  }
}
