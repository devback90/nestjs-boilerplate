import { Module } from '@nestjs/common';
import { DbCoreService } from './db-core.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SkuEntity } from './sku.entity';
import { ProductEntity } from './product.entity';
import { InventoryStockEntity } from './inventory-stock.entity';
import { FulfillmentCenterEntity } from './fulfillment-center.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { MySqlDriver } from '@mikro-orm/mysql';
import { InventoryStockRepository } from './inventory-stock.repository';
import { SkuRepository } from './sku.repository';
import { ProductRepository } from './product.repository';

@Module({
  imports: [
    ConfigModule,
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        driver: MySqlDriver,
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        user: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        dbName: configService.get<string>('DB_NAME'),
        entities: [
          SkuEntity,
          ProductEntity,
          InventoryStockEntity,
          FulfillmentCenterEntity,
        ],

        entitiesTs: ['libs/storage/db-core/src/*.entity.ts'],

        metadataProvider: TsMorphMetadataProvider,

        registerRequestContext: true,

        debug: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),
    MikroOrmModule.forFeature({
      entities: [
        SkuEntity,
        ProductEntity,
        InventoryStockEntity,
        FulfillmentCenterEntity,
      ],
    }),
  ],
  providers: [DbCoreService],
  exports: [DbCoreService,MikroOrmModule],
})
export class DbCoreModule {}
