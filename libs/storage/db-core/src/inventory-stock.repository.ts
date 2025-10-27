import { EntityRepository, raw } from '@mikro-orm/mysql';
import { InventoryStockEntity } from './inventory-stock.entity';

export class InventoryStockRepository extends EntityRepository<InventoryStockEntity> {
  /**
   * 재고 엔티티를 Sku와 Fc 기준으로 찾는 커스텀 메서드
   * @param skuId SKU ID
   * @param fcId FC ID
   * @returns InventoryStockEntity | null
   */
  public findOneBySkuAndFc(
    skuId: string,
    fcId: string,
  ): Promise<InventoryStockEntity | null> {
    // findOne은 기본 EntityRepository의 메서드입니다.
    // 복잡한 쿼리가 필요하면 qb.select(...).where(...) 등을 사용할 수 있습니다.
    return this.findOne({
      sku: { id: skuId },
      fc: { id: fcId },
    });
  }

  // (예시) 낙관적 락을 사용하지 않고 직접 버전과 함께 업데이트하는 메서드
  public async decreaseStockWithVersion(
    id: string,
    amount: number,
    version: number,
  ) {
    const qb = this.em.createQueryBuilder(InventoryStockEntity, 'stock');
    qb.update({
      quantity: raw('quantity - ?', [amount]),
      version: raw('version + 1'),
    }).where({ id, version, quantity: { $gte: amount } });

    return qb.execute(); // 영향을 받은 행의 수 (0 또는 1)를 반환
  }
}
