import { EntityRepository } from '@mikro-orm/mysql';
import { ProductEntity } from './product.entity';

export class ProductRepository extends EntityRepository<ProductEntity> {

}