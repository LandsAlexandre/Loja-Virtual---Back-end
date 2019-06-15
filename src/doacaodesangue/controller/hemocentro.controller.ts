import {
  Controller,
  Get,
  Res,
  Param,
  HttpStatus,
  Body,
  Post,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { Hemocentro } from '../model/hemocentro.entity';
import { ApiUseTags } from '@nestjs/swagger';
import { Montador } from '../service/logica/montador.logica';
import { Relatorio } from '../service/logica/relatorio.logica';
import { Funcionamento } from '../model/funcionamento.entity';
import { Endereco } from '../model/endereco.entity';

@ApiUseTags('Hemocentro')
@Controller()
export class HemocentroController {
  constructor(
    private readonly montador: Montador,
    private readonly relatorios: Relatorio,
  ) {}

  @Get('/hemocentro')
  root(): any {
    return this.montador.pegaHemocentros();
  }

  @Get('/hemocentro/demandas')
  async relatorio(@Res() res) {
    try {
      let hemocentro = await this.relatorios.hemocentroDemanda();
      if (hemocentro != undefined) {
        res.status(HttpStatus.OK).send(hemocentro);
      } else {
        res
          .status(HttpStatus.NOT_FOUND)

          .send('Nenhuma demanda registrada');
      }
    } catch (err) {
      res.status(HttpStatus.BAD_GATEWAY).send(err.message);
    }
  }

  @Get('/Hemocentro/:id')
  async readOne(@Res() res, @Param() id) {
    try {
      let hemocentro: Hemocentro = await this.montador.leUmHemocentro(id.id);
      if (hemocentro != undefined) {
        res.status(HttpStatus.OK).send(hemocentro);
      } else {
        res
          .status(HttpStatus.NOT_FOUND)

          .send('Nenhum usuário encontrado na busca');
      }
    } catch (err) {
      res.status(HttpStatus.BAD_GATEWAY).send(err.message);
    }
  }

  @Post('/Hemocentro')
  public async createOne(@Body() body): Promise<Hemocentro | any> {
    let enderecoNovo: Endereco = await this.montador.montaEndereco(body);

    let hemocentro: Hemocentro = await this.montador.montaHemocentro(
      body,
      enderecoNovo,
    );

    console.log('passei do hemocentro');

    //Criar dias de funcionamento da semana
    let funcionamento: Funcionamento = await this.montador.horarioFuncionamento(
      body,
    );
    console.log('passei do funcionamento');

    // dias da semana

    await this.montador.montaDias(body, funcionamento);

    return await this.montador.hemocentro_funcionamento(
      hemocentro,
      funcionamento,
    );
  }

  @Put('/Hemocentro')
  public updateOne(@Body() body: any) {
    return this.montador.alteraHemocentro(body);
  }

  @Delete('/Hemocentro/:id')
  public deleteOne(@Body() body: any): Promise<Hemocentro> {
    return this.montador.deletarHemocentro(body);
  }
}
