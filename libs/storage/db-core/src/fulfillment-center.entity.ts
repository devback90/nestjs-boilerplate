import { Entity, Property, OneToMany, Collection } from "@mikro-orm/core";
import { InventoryStockEntity } from "./inventory-stock.entity";
import { BaseEntity } from './base.entity';

@Entity({tableName:'fulfillment_center'})
export class FulfillmentCenterEntity extends BaseEntity {
  @Property()
  name: string; // 예: "서울 센터", "부산 센터"

  // FC는 여러 SKU의 재고를 보유할 수 있습니다. (1:N)
  @OneToMany(() => InventoryStockEntity, stock => stock.fc)
  stocks = new Collection<InventoryStockEntity>(this);

  constructor(name: string) {
    super();
    this.name = name;
  }
}
