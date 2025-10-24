import {BaseEntity, Entity, Property} from "@mikro-orm/core";

@Entity()
export class SkuEntity extends BaseEntity {

    @Property()
    productId: string;

    @Property()
    quantity: number;

    constructor(productId: string, quantity: number) {
        super();
        this.productId = productId;
        this.quantity = quantity;
    }

}