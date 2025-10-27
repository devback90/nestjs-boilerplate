import { Injectable, NotFoundException } from '@nestjs/common';
import { InventoryStockRepository } from '../../../libs/storage/db-core/src/inventory-stock.repository';

@Injectable()
export class StockService {
  constructor(private readonly stockRepository: InventoryStockRepository) {}

  async getStock(skuId: string, fcId: string): Promise<{ quantity: number }> {
    // 3. 캐시 로직 없이 바로 DB 조회
    const stock = await this.stockRepository.findOneBySkuAndFc(skuId, fcId);

    if (!stock) {
      throw new NotFoundException('재고 정보를 찾을 수 없습니다.');
    }

    // 4. 조회 결과를 바로 반환
    return { quantity: stock.quantity };
  }
}
