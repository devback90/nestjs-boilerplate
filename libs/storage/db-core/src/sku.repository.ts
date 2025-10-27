import { EntityRepository } from '@mikro-orm/mysql';
import { SkuEntity } from './sku.entity';

export class SkuRepository extends EntityRepository<SkuEntity> {}
