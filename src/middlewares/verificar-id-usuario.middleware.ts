import { NextFunction, Request, Response } from "express";
import { UsuarioService } from "../services";

export class VerificarIdUsuario {
  public async validar(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    const service = new UsuarioService();

    const response = await service.listarPorID(id);

    if (!response.ok) {
      return res.status(response.code).json(response);
    }

    return next();
  }
}
