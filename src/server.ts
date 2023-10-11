import cors from "cors";
import "dotenv/config";
import express, { Request, Response } from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.listen(process.env.PORT, () =>
  console.log(`Server is up in port ${process.env.PORT}`)
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json("Atividade final de módulo - Banco de Dados II");
});
