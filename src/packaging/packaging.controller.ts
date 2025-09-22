import { Body, Controller, Post } from '@nestjs/common';
import { PackagingService } from './packaging.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('packaging')
export class PackagingController {
  constructor(private readonly packagingService: PackagingService) {}

  @Post('pack-orders')
  public packOrders(@Body() order: CreateOrderDto) {
    return this.packagingService.packOrders(order);
  }
}
