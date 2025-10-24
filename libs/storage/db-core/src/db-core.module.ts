import {Module} from '@nestjs/common';
import {DbCoreService} from './db-core.service';
import {MikroOrmModule} from "@mikro-orm/nestjs";

@Module({
    imports: [MikroOrmModule.forRoot(),
        MikroOrmModule.forFeature({
            entities: [],
        }),],
    providers: [DbCoreService],
    exports: [DbCoreService, MikroOrmModule],
})

export class DbCoreModule {
}
