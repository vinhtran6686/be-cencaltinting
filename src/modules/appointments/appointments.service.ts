import { Injectable, NotFoundException, Logger, Inject } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types } from 'mongoose';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './schemas/appointment.schema';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectConnection() private connection: Connection,
    @Inject('APPOINTMENTS_DEBUG') private debug: boolean
  ) {
    // Debug connection and collection info
    this.logger.log('AppointmentsService initialized');
    this.logger.debug(`MongoDB Connection state: ${this.connection.readyState}`);
    
    const collections = this.connection.collections;
    this.logger.debug(`Available collections: ${Object.keys(collections).join(', ')}`);
    
    // Explicitly specify the collection to ensure proper mapping
    this.appointmentModel = this.connection.model(Appointment.name, this.appointmentModel.schema, 'appointments');
  }

  async findAll(options: {
    page: number;
    limit: number;
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }) {
    const { page, limit, status, startDate, endDate, search } = options;
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (startDate) {
      query.startDate = { $gte: new Date(startDate) };
    }
    
    if (endDate) {
      query.endDate = { ...query.endDate, $lte: new Date(endDate) };
    }
    
    if (search) {
      query.notes = { $regex: search, $options: 'i' };
    }
    
    this.logger.debug(`Finding appointments with query: ${JSON.stringify(query)}`);
    
    try {
      // Debug more information about the collection
      this.logger.debug(`Appointments collection name: ${this.appointmentModel.collection.name}`);
      this.logger.debug(`Appointments collection exists: ${this.appointmentModel.collection.collectionName ? 'yes' : 'no'}`);
      
      // Get raw data directly from MongoDB to bypass schema validation
      const collection = this.connection.db.collection('appointments');
      
      // Count total documents matching query
      const total = await collection.countDocuments(query);
      this.logger.debug(`Total appointments matching query in raw MongoDB: ${total}`);
      
      // Get documents with pagination
      const appointments = await collection
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .toArray();
      
      this.logger.debug(`Found ${appointments.length} appointments using raw MongoDB query`);
      
      return {
        data: appointments,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`Error fetching appointments: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      this.logger.debug(`Finding appointment by ID: ${id}`);
      
      // Use raw MongoDB query to bypass schema validation
      const collection = this.connection.db.collection('appointments');
      const appointment = await collection.findOne({ _id: new Types.ObjectId(id) });
      
      if (!appointment) {
        throw new NotFoundException(`Appointment with ID ${id} not found`);
      }
      
      return appointment;
    } catch (error) {
      this.logger.error(`Error finding appointment ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async create(createAppointmentDto: CreateAppointmentDto) {
    try {
      // Create a new appointment
      const newAppointment = new this.appointmentModel({
        ...createAppointmentDto,
        status: 'scheduled',
      });
      
      // Save to database
      const savedAppointment = await newAppointment.save();
      this.logger.debug(`Created new appointment with ID: ${savedAppointment._id}`);
      return savedAppointment;
    } catch (error) {
      this.logger.error(`Error creating appointment: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    try {
      const updatedAppointment = await this.appointmentModel
        .findByIdAndUpdate(
          id,
          { ...updateAppointmentDto },
          { new: true, runValidators: true }
        )
        .exec();
      
      if (!updatedAppointment) {
        throw new NotFoundException(`Appointment with ID ${id} not found`);
      }
      
      this.logger.debug(`Updated appointment with ID: ${id}`);
      return updatedAppointment;
    } catch (error) {
      this.logger.error(`Error updating appointment ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const result = await this.appointmentModel.findByIdAndDelete(id).exec();
      
      if (!result) {
        throw new NotFoundException(`Appointment with ID ${id} not found`);
      }
      
      this.logger.debug(`Removed appointment with ID: ${id}`);
      return {
        message: 'Appointment successfully canceled',
      };
    } catch (error) {
      this.logger.error(`Error removing appointment ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
} 