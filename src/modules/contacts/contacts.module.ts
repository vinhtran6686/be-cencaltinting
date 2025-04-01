import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { Contact, ContactSchema } from './schemas/contact.schema';

// Add debug logging
const logger = new Logger('ContactsModule');
logger.debug('Registering Contacts module');

@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: Contact.name, 
        schema: ContactSchema,
        collection: 'contacts'
      },
    ]),
  ],
  controllers: [ContactsController],
  providers: [
    {
      provide: 'CONTACTS_DEBUG',
      useValue: true,
    },
    ContactsService
  ],
  exports: [ContactsService],
})
export class ContactsModule {
  constructor() {
    logger.debug('ContactsModule initialized');
  }
} 