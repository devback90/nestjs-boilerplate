import { Module } from '@nestjs/common';
import { DbCoreService } from './db-core.service';

@Module({
  providers: [DbCoreService],
  exports: [DbCoreService],
})

export class DbCoreModule {}
