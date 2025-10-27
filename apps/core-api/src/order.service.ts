import { Injectable } from '@nestjs/common';
import { InventoryStockRepository } from '../../../libs/storage/db-core/src/inventory-stock.repository';
import { OptimisticLockError, Transactional } from '@mikro-orm/core';

@Injectable()
export class OrderService {
  constructor(private readonly stockRepository: InventoryStockRepository) {}

  @Transactional()
  async createOrder(
    skuId: string,
    fcId: string,
    orderQuantity: number,
  ): Promise<void> {
    const cacheKey = `stock:${skuId}:${fcId}`;

    try {
      // em.transactional 래퍼 없이 바로 Repo 사용
      const stock = await this.stockRepository.findOneBySkuAndFc(skuId, fcId); // Point 1

      if (!stock) {
        throw new Error('재고 정보를 찾을 수 없습니다.');
      }

      // 엔티티 도메인 메서드 호출 (낙관적 락 'version' 자동 관리)
      stock.decreaseStock(orderQuantity);

      // 메서드가 성공적으로 종료되면 @Transactional이 자동 flush/commit

      // (참고: 트랜잭션 커밋 *후에* 캐시를 지우려면
      // @OnSuccess() 이벤트 리스너 사용을 고려해야 합니다.)
      // await this.cacheManager.del(cacheKey);
    } catch (e) {
      if (e instanceof OptimisticLockError) {
        console.error('재고 동시성 충돌 발생', e);
        throw new Error(
          '동시에 주문이 처리되었습니다. 잠시 후 다시 시도해주세요.',
        );
      }
      throw e;
    }
  }
}
