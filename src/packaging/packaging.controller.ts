import { Body, Controller, Post } from '@nestjs/common';
import { PackagingService } from './packaging.service';
import { RequestOptimizeOrdersDto } from './dto/create-order.dto';

@Controller('packaging')
export class PackagingController {
  constructor(private readonly packagingService: PackagingService) {}

  @Post('optimize')
  public optimizeOrders(@Body() order: RequestOptimizeOrdersDto) {
    return this.packagingService.optimizeOrders(order);
  }
}
