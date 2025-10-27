import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DbCoreModule } from '@app/storage/db-core';
import { OrderService } from './order.service';
import { StockService } from './stock.service';
import { OrderController } from './order.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbCoreModule,
  ],
  controllers: [AppController,OrderController],
  providers: [AppService,OrderService,StockService],
})
export class AppModule {}
