import { Tweets as TweetsPrisma } from "@prisma/client";
import { ResponseDTO } from "../dtos";
import { CriarTweetDTO } from "../dtos/criar-tweet.dto";
import { Tweet } from "../models";

export class TweetService {
  private mapToModel(TweetDB: TweetsPrisma): Tweet {
    return new Tweet(
      TweetDB.id,
      TweetDB.content,
      TweetDB.type,
      TweetDB.usuarioId
    );
  }

  public async cadastrar(dados: CriarTweetDTO): Promise<ResponseDTO> {
}
