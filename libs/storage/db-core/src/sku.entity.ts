import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { SkuRepository } from './sku.repository';
import { ProductEntity } from './product.entity';
import { InventoryStockEntity } from './inventory-stock.entity';
import { BaseEntity } from './base.entity';

@Entity({tableName:'sku', repository: () => SkuRepository })
export class SkuEntity extends BaseEntity {
  @Property()
  optionName: string;

  @ManyToOne(() => ProductEntity)
  product: ProductEntity;

  // SKU는 여러 FC에 걸쳐 재고를 가질 수 있습니다. (1:N)
  @OneToMany(() => InventoryStockEntity, stock => stock.sku)
  stocks = new Collection<InventoryStockEntity>(this);

  constructor(product: ProductEntity, optionName: string) {
    super();
    this.product = product;
    this.optionName = optionName;
  }
}
