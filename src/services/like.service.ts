import { Likes as LikesPrisma } from "@prisma/client";
import repository from "../database/prisma.connection";
import { ResponseDTO } from "../dtos";
import { CriarLikeDTO } from "../dtos/criar-like.dto";
import { Like } from "../models/like.model";

export class LikeService {
  private async mapToModel(LikeDB: LikesPrisma): Promise<Like> {
    return new Like(LikeDB.id);
  }

  public async criar(
    dados: CriarLikeDTO,
    usuarioId: string
  ): Promise<ResponseDTO> {
    const likeDB = await repository.likes.create({
      data: {
        usuario: { connect: { id: usuarioId } },
        tweet: { connect: { id: dados.tweetId } },
      },
    });

    return {
      code: 201,
      ok: true,
      mensagem: "Like criado!",
      dados: this.mapToModel({ ...likeDB }),
    };
  }

  public async deletar(id: string): Promise<ResponseDTO> {
    const likeExcluido = await repository.likes.delete({
      where: { id: id },
    });

    return {
      code: 200,
      ok: true,
      mensagem: "Like excluido",
      dados: this.mapToModel(likeExcluido),
    };
  }
}
