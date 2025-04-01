import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EasyPlayersController } from './easyplayers.controller';
import { EasyPlayersService } from './easyplayers.service';
import { EasyPlayer, EasyPlayerSchema } from './schemas/easyplayer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EasyPlayer.name, schema: EasyPlayerSchema },
    ]),
  ],
  controllers: [EasyPlayersController],
  providers: [EasyPlayersService],
  exports: [EasyPlayersService],
})
export class EasyPlayersModule {} 