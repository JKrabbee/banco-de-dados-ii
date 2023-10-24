import { Request, Response } from "express";
import { LikeService } from "../services";

export class LikeController {
  public async criar(req: Request, res: Response) {
    try {
      const usuarioId = req.params;
      const { tweetId } = req.body;

      const service = new LikeService();
      const response = await service.criar({ tweetId }, usuarioId.id);

      return res.status(response.code).json(response);
    } catch (error: any) {
      return res.status(500).json({
        code: 500,
        ok: false,
        mensagem: error.toString(),
      });
    }
  }

  public async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = new LikeService();

      const response = await service.deletar(id);

      return res.status(response.code).json(response);
    } catch (error: any) {
      return res.status(500).json({
        code: 500,
        ok: false,
        mensagem: error.toString(),
      });
    }
  }
}
