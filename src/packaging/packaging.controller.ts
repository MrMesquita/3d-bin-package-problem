import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PackagingService } from './packaging.service';
import { RequestOptimizeOrdersDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('packaging')
@UseGuards(JwtAuthGuard)
export class PackagingController {
  constructor(private readonly packagingService: PackagingService) {}

  @Post('optimize')
  @HttpCode(HttpStatus.OK)
  public optimizeOrders(@Body() order: RequestOptimizeOrdersDto) {
    return this.packagingService.optimizeOrders(order);
  }
}
