import { Likes as LikesPrisma, Tweets as TweetsPrisma } from "@prisma/client";
import repository from "../database/prisma.connection";
import { AtualizarTweetDTO, ResponseDTO } from "../dtos";
import { CriarTweetDTO } from "../dtos/criar-tweet.dto";
import { Tweet } from "../models";
import { Like } from "../models/like.model";

export class TweetService {
  private async mapToModel(
    TweetDB: TweetsPrisma & { likes: LikesPrisma[] | null }
  ): Promise<Tweet> {
    const likesTweet = TweetDB?.likes
      ? TweetDB.likes.map((LikesDB) => new Like(LikesDB.id))
      : undefined;

    return new Tweet(TweetDB.id, TweetDB.content, TweetDB.type, likesTweet);
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
      include: {
        likes: true,
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
      include: {
        likes: true,
      },
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
      include: {
        likes: true,
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
      include: {
        likes: true,
      },
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
      include: {
        likes: true,
      },
    });

    return {
      code: 200,
      ok: true,
      mensagem: "Tweet excluido",
      dados: this.mapToModel(tweetExcluido),
    };
  }
}
