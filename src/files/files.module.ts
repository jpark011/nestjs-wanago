import { PublicFile } from './public-file.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from './files.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([PublicFile])],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
