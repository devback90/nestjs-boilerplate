import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
// import { AppController } from './app.controller';
import { OrderService } from './order.service';
import { StockService } from './stock.service';
import { CreateOrderDto } from './create-order.dto';

@Controller('order')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(
    private readonly orderService: OrderService,
    private readonly stockService: StockService,
  ) {}

  /**
   * 재고 조회 API (1000 TPS)
   * @param skuId
   * @param fcId
   */
  @Get('stock/:skuId/:fcId')
  async getStock(
    @Param('skuId') skuId: string,
    @Param('fcId') fcId: string,
  ): Promise<{ quantity: number }> {
    // StockService가 캐싱 및 DB 조회를 처리
    return this.stockService.getStock(skuId, fcId);
  }

  /**
   * 주문 생성 API (동시성 처리)
   * @param createOrderDto
   */
  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      await this.orderService.createOrder(
        createOrderDto.skuId,
        createOrderDto.fcId,
        createOrderDto.quantity,
      );
      return { success: true };
    } catch (error) {
      // (실제 프로덕션에서는 ExceptionFilter를 사용해 공통 처리합니다.)

      // 낙관적 락 충돌 또는 재고 부족 등
      this.logger.error(`Order creation failed: ${error.message}`, error.stack);

      // 사용자에게 안전한 에러 메시지 반환
      if (error.message.includes('다시 시도')) {
        // (OptimisticLockError)
        throw new HttpException(error.message, HttpStatus.CONFLICT); // 409
      }
      // (재고 부족 등 비즈니스 에러)
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST); // 400
    }
  }
}
