import { Tweets as TweetsPrisma } from "@prisma/client";
import repository from "../database/prisma.connection";
import { AtualizarTweetDTO, ResponseDTO } from "../dtos";
import { CriarTweetDTO } from "../dtos/criar-tweet.dto";
import { Tweet } from "../models";

export class TweetService {
  private mapToModel(TweetDB: TweetsPrisma): Tweet {
    return new Tweet(TweetDB.id, TweetDB.content, TweetDB.type);
  }

  public async criar(
    dados: CriarTweetDTO,
    usuarioId: string
  ): Promise<ResponseDTO> {
    const tweetDB = await repository.tweets.create({
      data: {
        content: dados.content,
        type: dados.type,
        usuario: { connect: { id: usuarioId } },
      },
    });

    return {
      code: 201,
      ok: true,
      mensagem: "Tweet criado!",
      dados: this.mapToModel({ ...tweetDB }),
    };
  }

  public async listar(): Promise<ResponseDTO> {
    const tweetsDB = await repository.tweets.findMany({
      orderBy: { criadoEm: "desc" },
    });

    if (!tweetsDB.length) {
      return {
        code: 404,
        ok: false,
        mensagem: "Não foram encontrados tweets criados no sistema.",
      };
    }

    return {
      code: 200,
      ok: true,
      mensagem: "Tweets listados com sucesso",
      dados: tweetsDB.map((a) => this.mapToModel(a)),
    };
  }

  public async listarPorID(id: string): Promise<ResponseDTO> {
    const tweetDB = await repository.tweets.findUnique({
      where: {
        id: id,
      },
    });

    if (!tweetDB) {
      return {
        code: 404,
        ok: false,
        mensagem: "Tweet não encontrado",
      };
    }

    return {
      code: 200,
      ok: true,
      mensagem: "usuario encontrado",
      dados: this.mapToModel(tweetDB),
    };
  }

  public async atualizar(
    dados: AtualizarTweetDTO,
    idTweet: string
  ): Promise<ResponseDTO> {
    const tweetAtualizado = await repository.tweets.update({
      where: { id: idTweet },
      data: { content: dados.content },
    });

    return {
      code: 200,
      ok: true,
      mensagem: "Tweet atualizado",
      dados: this.mapToModel(tweetAtualizado),
    };
  }

  public async deletar(id: string): Promise<ResponseDTO> {
    const tweetExcluido = await repository.tweets.delete({
      where: { id: id },
    });

    return {
      code: 200,
      ok: true,
      mensagem: "usuario excluido",
      dados: this.mapToModel(tweetExcluido),
    };
  }
}
