import { Injectable, NotFoundException, Logger, Inject } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types } from 'mongoose';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './schemas/appointment.schema';
import { IdLabelItem } from './types/vehicle.types';

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

  /**
   * Get a list of available vehicle years in ID+value format
   * @returns Array of vehicle years in ID+value format
   */
  async getVehicleYears(): Promise<IdLabelItem[]> {
    try {
      this.logger.debug('Fetching available vehicle years');
      
      // Get distinct years from the database
      const collection = this.connection.db.collection('vehicles');
      const years = await collection.distinct('year');
      
      // If vehicles collection is empty, provide sample data
      if (!years || years.length === 0) {
        this.logger.debug('No vehicle years found, returning sample data');
        return [
          { id: '2024', value: '2024' },
          { id: '2023', value: '2023' },
          { id: '2022', value: '2022' }
        ];
      }
      
      // Sort years in descending order (newest first)
      years.sort((a, b) => parseInt(b) - parseInt(a));
      
      // For debugging
      this.logger.debug(`Found years: ${JSON.stringify(years)}`);
      
      // Return in ID+value format
      const result = years.map(year => ({
        id: year.toString(),
        value: year.toString()
      }));
      
      this.logger.debug(`Transformed years: ${JSON.stringify(result)}`);
      
      return result;
    } catch (error) {
      this.logger.error(`Error fetching vehicle years: ${error.message}`, error.stack);
      // Return sample data instead of empty array
      return [
        { id: '2024', value: '2024' },
        { id: '2023', value: '2023' },
        { id: '2022', value: '2022' }
      ];
    }
  }

  /**
   * Get a list of available vehicle makes/manufacturers in ID+value format
   * @param year Optional filter by year
   * @returns Array of vehicle makes in ID+value format
   */
  async getVehicleMakes(year?: string): Promise<IdLabelItem[]> {
    try {
      this.logger.debug(`Fetching available vehicle makes with year filter: ${year || 'none'}`);
      
      const collection = this.connection.db.collection('vehicles');
      
      // Build query
      const query: any = {};
      if (year) {
        query.year = year;
      }
      
      // Get distinct makes matching the query
      const makes = await collection.distinct('make', query);
      
      // If no makes found or vehicles collection is empty, provide sample data
      if (!makes || makes.length === 0) {
        this.logger.debug('No vehicle makes found, returning sample data');
        return [
          { id: 'Toyota', value: 'Toyota' },
          { id: 'Honda', value: 'Honda' },
          { id: 'Ford', value: 'Ford' }
        ];
      }
      
      // Sort alphabetically
      makes.sort();
      
      // For debugging
      this.logger.debug(`Found makes: ${JSON.stringify(makes)}`);
      
      // Return in ID+value format
      const result = makes.map(make => ({
        id: make.toString(),
        value: make.toString()
      }));
      
      this.logger.debug(`Transformed makes: ${JSON.stringify(result)}`);
      
      return result;
    } catch (error) {
      this.logger.error(`Error fetching vehicle makes: ${error.message}`, error.stack);
      return [
        { id: 'Toyota', value: 'Toyota' },
        { id: 'Honda', value: 'Honda' },
        { id: 'Ford', value: 'Ford' }
      ];
    }
  }

  /**
   * Get a list of available vehicle models in ID+value format
   * @param year Optional filter by year
   * @param make Optional filter by make
   * @returns Array of vehicle models in ID+value format
   */
  async getVehicleModels(year?: string, make?: string): Promise<IdLabelItem[]> {
    try {
      this.logger.debug(`Fetching available vehicle models with filters: year=${year || 'none'}, make=${make || 'none'}`);
      
      const collection = this.connection.db.collection('vehicles');
      
      // Build query
      const query: any = {};
      if (year) {
        query.year = year;
      }
      if (make) {
        query.make = make;
      }
      
      // Get distinct models matching the query
      const models = await collection.distinct('model', query);
      
      // If no models found or vehicles collection is empty, provide sample data
      if (!models || models.length === 0) {
        this.logger.debug('No vehicle models found, returning sample data');
        return [
          { id: 'Camry', value: 'Camry' },
          { id: 'Corolla', value: 'Corolla' },
          { id: 'RAV4', value: 'RAV4' }
        ];
      }
      
      // Sort alphabetically
      models.sort();
      
      // For debugging
      this.logger.debug(`Found models: ${JSON.stringify(models)}`);
      
      // Return in ID+value format
      const result = models.map(model => ({
        id: model.toString(),
        value: model.toString()
      }));
      
      this.logger.debug(`Transformed models: ${JSON.stringify(result)}`);
      
      return result;
    } catch (error) {
      this.logger.error(`Error fetching vehicle models: ${error.message}`, error.stack);
      return [
        { id: 'Camry', value: 'Camry' },
        { id: 'Corolla', value: 'Corolla' },
        { id: 'RAV4', value: 'RAV4' }
      ];
    }
  }

  /**
   * Get a list of available vehicle types in ID+value format
   * @param year Optional filter by year
   * @param make Optional filter by make
   * @param model Optional filter by model
   * @returns Array of vehicle types in ID+value format
   */
  async getVehicleTypes(year?: string, make?: string, model?: string): Promise<IdLabelItem[]> {
    try {
      this.logger.debug(`Fetching available vehicle types with filters: year=${year || 'none'}, make=${make || 'none'}, model=${model || 'none'}`);
      
      const collection = this.connection.db.collection('vehicles');
      
      // Build query
      const query: any = {};
      if (year) {
        query.year = year;
      }
      if (make) {
        query.make = make;
      }
      if (model) {
        query.model = model;
      }
      
      // Get distinct types matching the query
      const types = await collection.distinct('vehicleType', query);
      
      // If no types found or vehicles collection is empty, provide sample data
      if (!types || types.length === 0) {
        this.logger.debug('No vehicle types found, returning sample data');
        return [
          { id: 'Sedan', value: 'Sedan' },
          { id: 'SUV', value: 'SUV' },
          { id: 'Truck', value: 'Truck' }
        ];
      }
      
      // Sort alphabetically
      types.sort();
      
      // For debugging
      this.logger.debug(`Found types: ${JSON.stringify(types)}`);
      
      // Return in ID+value format
      const result = types.map(type => ({
        id: type.toString(),
        value: type.toString()
      }));
      
      this.logger.debug(`Transformed types: ${JSON.stringify(result)}`);
      
      return result;
    } catch (error) {
      this.logger.error(`Error fetching vehicle types: ${error.message}`, error.stack);
      return [
        { id: 'Sedan', value: 'Sedan' },
        { id: 'SUV', value: 'SUV' },
        { id: 'Truck', value: 'Truck' }
      ];
    }
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