import { Module } from '@nestjs/common';
import { DbCoreService } from './db-core.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { MySqlDriver } from '@mikro-orm/mysql';


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

        ],

        entitiesTs: ['libs/storage/db-core/src/*.entity.ts'],

        metadataProvider: TsMorphMetadataProvider,

        registerRequestContext: true,

        debug: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),
    MikroOrmModule.forFeature({
      entities: [

      ],
    }),
  ],
  providers: [DbCoreService],
  exports: [DbCoreService,MikroOrmModule],
})
export class DbCoreModule {}
