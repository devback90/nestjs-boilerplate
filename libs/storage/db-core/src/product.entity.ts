import {BaseEntity, Entity, Property} from "@mikro-orm/core";


@Entity()
export class ProductEntity extends BaseEntity {
    @Property()
    name: string;

    constructor(name: string) {
        super();
        this.name = name;

    }

}