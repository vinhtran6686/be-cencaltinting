import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEasyPlayerDto } from './dto/create-easyplayer.dto';
import { UpdateEasyPlayerDto } from './dto/update-easyplayer.dto';
import { EasyPlayer, EasyPlayerDocument } from './schemas/easyplayer.schema';

@Injectable()
export class EasyPlayersService {
  constructor(
    @InjectModel(EasyPlayer.name) private readonly easyPlayerModel: Model<EasyPlayerDocument>,
  ) {}

  /**
   * Create a new player
   */
  async create(createEasyPlayerDto: CreateEasyPlayerDto): Promise<EasyPlayer> {
    const createdPlayer = new this.easyPlayerModel(createEasyPlayerDto);
    return createdPlayer.save();
  }

  /**
   * Find all players
   */
  async findAll(): Promise<EasyPlayer[]> {
    return this.easyPlayerModel.find().exec();
  }

  /**
   * Find a player by ID
   */
  async findOne(id: string): Promise<EasyPlayer> {
    const player = await this.easyPlayerModel.findById(id).exec();
    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }
    return player;
  }

  /**
   * Update a player
   */
  async update(id: string, updateEasyPlayerDto: UpdateEasyPlayerDto): Promise<EasyPlayer> {
    const updatedPlayer = await this.easyPlayerModel
      .findByIdAndUpdate(id, updateEasyPlayerDto, { new: true })
      .exec();
    
    if (!updatedPlayer) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }
    
    return updatedPlayer;
  }

  /**
   * Delete a player
   */
  async remove(id: string): Promise<void> {
    const result = await this.easyPlayerModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }
  }

  /**
   * Generate a fake error
   */
  generateError(statusCode: number): void {
    const statusErrors = {
      400: 'Bad Request Error',
      401: 'Unauthorized Error',
      403: 'Forbidden Error',
      404: 'Not Found Error',
      500: 'Internal Server Error',
    };

    const errorMessage = statusErrors[statusCode] || 'Generic Error';
    const error: any = new Error(errorMessage);
    error.status = statusCode;
    
    throw error;
  }

  /**
   * Create a delayed response
   */
  async delayedResponse(seconds: number): Promise<{ message: string; delayedBy: number }> {
    await new Promise(resolve => setTimeout(resolve, seconds * 1000));
    return {
      message: 'Delayed response completed',
      delayedBy: seconds,
    };
  }

  /**
   * Generate a random response
   */
  generateRandomResponse(): unknown {
    const responses = [
      { success: true, message: 'Operation successful' },
      { error: 'Something went wrong', code: 'ERR_001' },
      [1, 2, 3, 4, 5],
      'Simple string response',
      42,
      { nested: { data: { complex: true, values: [1, 2, 3] } } },
    ];
    
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  }
} 