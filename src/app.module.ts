import { Module } from '@nestjs/common';
import { PackagingModule } from './packaging/packaging.module';

@Module({
  imports: [PackagingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
