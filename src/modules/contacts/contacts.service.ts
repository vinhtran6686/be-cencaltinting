import { Injectable, NotFoundException, Logger, Inject } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types } from 'mongoose';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './schemas/contact.schema';

@Injectable()
export class ContactsService {
  private readonly logger = new Logger(ContactsService.name);

  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
    @InjectConnection() private connection: Connection,
    @Inject('CONTACTS_DEBUG') private debug: boolean
  ) {
    // Debug connection and collection info
    this.logger.log('ContactsService initialized');
    this.logger.debug(`MongoDB Connection state: ${this.connection.readyState}`);
    
    const collections = this.connection.collections;
    this.logger.debug(`Available collections: ${Object.keys(collections).join(', ')}`);
    
    // Explicitly specify the collection to ensure proper mapping
    this.contactModel = this.connection.model(Contact.name, this.contactModel.schema, 'contacts');
  }

  async findAll(options: {
    page: number;
    limit: number;
    search?: string;
  }) {
    const { page, limit, search } = options;
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = {};
    
    if (search) {
      // Use regex for search
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    this.logger.debug(`Finding contacts with query: ${JSON.stringify(query)}`);
    
    try {
      // Debug more information about the collection
      this.logger.debug(`Contacts collection name: ${this.contactModel.collection.name}`);
      this.logger.debug(`Contacts collection exists: ${this.contactModel.collection.collectionName ? 'yes' : 'no'}`);
      
      // Get raw data directly from MongoDB to bypass schema validation
      const collection = this.connection.db.collection('contacts');
      
      // Count total documents matching query
      const total = await collection.countDocuments(query);
      this.logger.debug(`Total contacts matching query in raw MongoDB: ${total}`);
      
      // Get documents with pagination
      const contacts = await collection
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .toArray();
      
      this.logger.debug(`Found ${contacts.length} contacts using raw MongoDB query`);
      
      return {
        data: contacts,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`Error fetching contacts: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      this.logger.debug(`Finding contact by ID: ${id}`);
      
      // Use raw MongoDB query to bypass schema validation
      const collection = this.connection.db.collection('contacts');
      const contact = await collection.findOne({ _id: new Types.ObjectId(id) });
      
      if (!contact) {
        throw new NotFoundException(`Contact with ID ${id} not found`);
      }
      
      return contact;
    } catch (error) {
      this.logger.error(`Error finding contact ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async create(createContactDto: CreateContactDto) {
    try {
      // Create a new contact
      const newContact = new this.contactModel({
        ...createContactDto
      });
      
      // Save to database
      const savedContact = await newContact.save();
      this.logger.debug(`Created new contact with ID: ${savedContact._id}`);
      return savedContact;
    } catch (error) {
      this.logger.error(`Error creating contact: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, updateContactDto: UpdateContactDto) {
    try {
      const updatedContact = await this.contactModel
        .findByIdAndUpdate(
          id,
          { ...updateContactDto },
          { new: true, runValidators: true }
        )
        .exec();
      
      if (!updatedContact) {
        throw new NotFoundException(`Contact with ID ${id} not found`);
      }
      
      this.logger.debug(`Updated contact with ID: ${id}`);
      return updatedContact;
    } catch (error) {
      this.logger.error(`Error updating contact ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const result = await this.contactModel.findByIdAndDelete(id).exec();
      
      if (!result) {
        throw new NotFoundException(`Contact with ID ${id} not found`);
      }
      
      this.logger.debug(`Removed contact with ID: ${id}`);
      return {
        message: 'Contact successfully deleted',
      };
    } catch (error) {
      this.logger.error(`Error removing contact ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
} 