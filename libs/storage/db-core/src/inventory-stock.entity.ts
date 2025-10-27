import {
  Entity,
  Property,
  ManyToOne,
  Unique,
} from '@mikro-orm/core';
import { SkuEntity } from './sku.entity';
import { FulfillmentCenterEntity } from './fulfillment-center.entity';
import { InventoryStockRepository } from './inventory-stock.repository';
import { BaseEntity } from './base.entity';

// Sku와 FC의 조합은 유일해야 합니다. (e.g., '190ml-서울' 재고는 단 하나의 레코드여야 함)
@Entity({tableName:'inventory_stock',repository: () => InventoryStockRepository})
@Unique({ properties: ['sku', 'fc'] })
export class InventoryStockEntity extends BaseEntity {
  // 이 재고가 어떤 SKU에 대한 것인지 (N:1)
  @ManyToOne(() => SkuEntity)
  sku: SkuEntity;

  // 이 재고가 어떤 FC에 있는지 (N:1)
  @ManyToOne(() => FulfillmentCenterEntity)
  fc: FulfillmentCenterEntity;

  @Property()
  quantity: number; // 재고 수량

  @Property({ version: true })
  version: number;

  /**
   * 도메인 로직: 재고를 차감합니다.
   * @param amount 차감할 수량
   */
  public decreaseStock(amount: number): void {
    if (this.quantity < amount) {
      // 비즈니스 예외 (e.g., 400 Bad Request)
      throw new Error('재고가 부족합니다.');
    }
    if (amount <= 0) {
      throw new Error('주문 수량은 0보다 커야 합니다.');
    }
    this.quantity -= amount;
  }

  constructor(sku: SkuEntity, fc: FulfillmentCenterEntity, quantity: number) {
    super();
    this.sku = sku;
    this.fc = fc;
    this.quantity = quantity;
  }
}
