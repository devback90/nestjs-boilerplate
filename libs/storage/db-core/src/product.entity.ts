import {  Entity, Property } from '@mikro-orm/core';
import { ProductRepository } from './product.repository';
import { BaseEntity } from './base.entity';

@Entity({tableName:'product', repository: () => ProductRepository })
export class ProductEntity extends BaseEntity {
  @Property()
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }
}
