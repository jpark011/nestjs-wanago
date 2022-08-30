import { ConfigService } from '@nestjs/config';
import { PublicFile } from './public-file.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { createHmac } from 'crypto';
import { Readable } from 'typeorm/platform/PlatformTools';
import { buffer } from 'stream/consumers';
import { firstValueFrom, pluck, tap } from 'rxjs';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {
  private url = this.configService.get('TENTH2_UPLOAD_URL');
  private downloadUrl = this.configService.get('TENTH2_DOWNLOAD_URL');
  private svcId = this.configService.get('TENTH2_SVC_ID');
  private wKey = this.configService.get('TENTH2_W_KEY');

  constructor(
    @InjectRepository(PublicFile)
    private publicFileRepo: Repository<PublicFile>,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const { path } = await firstValueFrom(
      this.tenth2Upload(dataBuffer, filename).pipe(
        pluck('data'),
        tap(console.log),
      ),
    );
    const newFile = this.publicFileRepo.create({
      filename,
      key: `${uuid()}-${filename}`,
      url: `${this.downloadUrl}${encodeURI(path)}`,
    });
    await this.publicFileRepo.save(newFile);

    return newFile;
  }

  async deletePublicFile(id: number, queryRunner: QueryRunner) {
    const file = await queryRunner.manager.findOne(PublicFile, {
      where: { id },
    });

    await firstValueFrom(
      this.tenth2Delete(file.filename).pipe(tap(console.log)),
    );

    await queryRunner.manager.delete(PublicFile, id);
  }

  private tenth2Upload(dataBuffer: Buffer, filename: string) {
    const { url, svcId, wKey } = this;
    const path = `/${svcId}/${filename}`;
    const date = new Date().toUTCString();
    const sign = createHmac('sha1', wKey)
      .update(`PUT\n\nmultipart/form-data\n${date}\n\n${path}`)
      .digest('base64');
    const size = dataBuffer.length;

    return this.httpService.put(`${url}${encodeURI(path)}`, dataBuffer, {
      headers: {
        Date: date,
        Authorization: `TWG ${svcId}:${sign}`,
        'Content-Length': size,
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  private tenth2Delete(filename: string) {
    const { url, svcId, wKey } = this;
    const path = `/${svcId}/${filename}`;
    const date = new Date().toUTCString();
    const sign = createHmac('sha1', wKey)
      .update(`DELETE\n\nmultipart/form-data\n${date}\n\n${path}`)
      .digest('base64');

    return this.httpService.delete(`${url}${encodeURI(path)}`, {
      headers: {
        Date: date,
        Authorization: `TWG ${svcId}:${sign}`,
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}
