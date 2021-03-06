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
import { HemocentroService } from '../service/hemocentro.service';
import { Hemocentro } from '../model/hemocentro.entity';
import { ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('Hemocentro')
@Controller()
export class HemocentroController {
  constructor(private readonly HemocentroService: HemocentroService) {}

  @Get('/Hemocentro')
  root(): any {
    return this.HemocentroService.readAll();
  }

  @Get('/hemocentro/demandas')
  async relatorio(@Res() res) {
    try {
      let hemocentro = await this.HemocentroService.hemocentroDemanda();
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
      let hemocentro: Hemocentro = await this.HemocentroService.readOne(id.id);
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
  public createOne(@Body() body: any): Promise<Hemocentro> {
    return this.HemocentroService.Create(body);
  }

  @Put('/Hemocentro')
  public updateOne(@Body() body: any) {
    return this.HemocentroService.Update(body);
  }
  @Delete('/Hemocentro/:id')
  public deleteOne(@Body() body: any): Promise<Hemocentro> {
    return this.HemocentroService.Drop(body);
  }
}
