import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { SharedModule } from '@/shared/modules/shared.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TerminusModule, SharedModule, HttpModule],
  controllers: [HealthController],
  providers: [],
})
export class HealthModule {}
