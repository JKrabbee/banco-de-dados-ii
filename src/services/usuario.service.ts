import {
  Tweets as TweetsPrisma,
  Usuarios as UsuariosPrisma,
} from "@prisma/client";
import { randomUUID } from "crypto";
import repository from "../database/prisma.connection";
import {
  AtualizarUsuarioDTO,
  CadastrarUsuarioDTO,
  LoginDTO,
  ResponseDTO,
} from "../dtos";
import { Tweet, Usuario } from "../models";

export class UsuarioService {
  public async cadastrar(dados: CadastrarUsuarioDTO): Promise<ResponseDTO> {
    const alunoExiste = await repository.usuarios.findUnique({
      where: { email: dados.email },
    });

    if (alunoExiste) {
      return {
        code: 400,
        ok: false,
        mensagem: "E-mail já cadastrado",
      };
    }

    const usuarioDB = await repository.usuarios.create({
      data: {
        nome: dados.nome,
        usuario: dados.usuario,
        email: dados.email,
        senha: dados.senha,
      },
    });

    return {
      code: 201,
      ok: true,
      mensagem: "Usuario cadastrado!",
      dados: this.mapToModel({ ...usuarioDB, tweets: null }),
    };
  }

  private async mapToModel(
    UsuarioDB: UsuariosPrisma & { tweets: TweetsPrisma[] | null }
  ): Promise<Usuario> {
    const tweetsUsuario = UsuarioDB?.tweets
      ? UsuarioDB.tweets.map(
          (tweetDB) => new Tweet(tweetDB.id, tweetDB.content, tweetDB.type)
        )
      : undefined;

    return new Usuario(
      UsuarioDB.id,
      UsuarioDB.nome,
      UsuarioDB.usuario,
      UsuarioDB.email,
      UsuarioDB.senha,
      tweetsUsuario
    );
  }

  public async login(dados: LoginDTO): Promise<ResponseDTO> {
    const usuarioEncontrado = await repository.usuarios.findUnique({
      where: {
        email: dados.email,
        senha: dados.senha,
      },
    });

    if (!usuarioEncontrado) {
      return {
        code: 401,
        ok: false,
        mensagem: "Credenciais inválidas",
      };
    }

    const token = randomUUID();

    await repository.usuarios.update({
      where: { id: usuarioEncontrado.id },
      data: { auth_token: token },
    });

    return {
      code: 200,
      ok: true,
      mensagem: "Login efetuado",
      dados: { token },
    };
  }

  public async logout(idUsuario: string): Promise<ResponseDTO> {
    await repository.usuarios.update({
      where: { id: idUsuario },
      data: { auth_token: null },
    });

    return {
      code: 200,
      ok: true,
      mensagem: "Usuario deslogado com sucesso",
    };
  }

  public async validarToken(token: string): Promise<string | null> {
    const usuarioEncontrado = await repository.usuarios.findFirst({
      where: { auth_token: token },
    });

    if (!usuarioEncontrado) return null;

    return usuarioEncontrado.id;
  }

  public async listar(): Promise<ResponseDTO> {
    const usuarioDB = await repository.usuarios.findMany({
      orderBy: { nome: "desc" },
      include: { tweets: true },
    });

    console.log("Resultado bruto da consulta ao banco de dados:", usuarioDB);

    if (!usuarioDB.length) {
      return {
        code: 404,
        ok: false,
        mensagem: "Não foram encontrados usuarios cadastrados no sistema.",
      };
    }

    return {
      code: 200,
      ok: true,
      mensagem: "Usuarios listados com sucesso",
      dados: usuarioDB.map((usuario) => this.mapToModel(usuario)),
    };
  }

  public async listarPorID(id: string): Promise<ResponseDTO> {
    const usuarioDB = await repository.usuarios.findUnique({
      where: {
        id: id,
      },
      include: {
        tweets: true,
      },
    });

    if (!usuarioDB) {
      return {
        code: 404,
        ok: false,
        mensagem: "usuario não encontrado",
      };
    }

    return {
      code: 200,
      ok: true,
      mensagem: "usuario encontrado",
      dados: this.mapToModel(usuarioDB),
    };
  }

  public async deletar(id: string): Promise<ResponseDTO> {
    const usuarioExcluido = await repository.usuarios.delete({
      where: { id: id },
      include: { tweets: true },
    });

    return {
      code: 200,
      ok: true,
      mensagem: "usuario excluido",
      dados: this.mapToModel(usuarioExcluido),
    };
  }

  public async atualizar(dados: AtualizarUsuarioDTO): Promise<ResponseDTO> {
    const usuarioAtualizado = await repository.usuarios.update({
      where: { id: dados.idUsuario },
      data: {
        nome: dados.nome,
        usuario: dados.usuario,
        senha: dados.senha,
      },
      include: { tweets: true },
    });

    return {
      code: 200,
      ok: true,
      mensagem: "Usuario atualizado",
      dados: this.mapToModel(usuarioAtualizado),
    };
  }
}
