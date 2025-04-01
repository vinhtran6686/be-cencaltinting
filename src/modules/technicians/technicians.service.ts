import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TechniciansService {
  // Mock data for demonstration purposes
  private technicians = [
    {
      _id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '555-123-4567',
      specialties: ['oil change', 'tire rotation', 'brake repair'],
      availability: {
        monday: { start: '08:00', end: '16:00' },
        tuesday: { start: '08:00', end: '16:00' },
        wednesday: { start: '08:00', end: '16:00' },
        thursday: { start: '08:00', end: '16:00' },
        friday: { start: '08:00', end: '16:00' },
        saturday: { start: '10:00', end: '14:00' },
        sunday: { start: '', end: '' }, // Off on Sunday
      },
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
    {
      _id: '2',
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '555-987-6543',
      specialties: ['electrical', 'diagnostics', 'ac service'],
      availability: {
        monday: { start: '09:00', end: '17:00' },
        tuesday: { start: '09:00', end: '17:00' },
        wednesday: { start: '09:00', end: '17:00' },
        thursday: { start: '09:00', end: '17:00' },
        friday: { start: '09:00', end: '17:00' },
        saturday: { start: '', end: '' }, // Off on Saturday
        sunday: { start: '10:00', end: '14:00' },
      },
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
    {
      _id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '555-456-7890',
      specialties: ['engine repair', 'transmission', 'suspension'],
      availability: {
        monday: { start: '07:00', end: '15:00' },
        tuesday: { start: '07:00', end: '15:00' },
        wednesday: { start: '07:00', end: '15:00' },
        thursday: { start: '07:00', end: '15:00' },
        friday: { start: '07:00', end: '15:00' },
        saturday: { start: '08:00', end: '12:00' },
        sunday: { start: '', end: '' }, // Off on Sunday
      },
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
  ];

  async findAll() {
    return this.technicians.map(tech => ({
      _id: tech._id,
      name: tech.name,
      specialties: tech.specialties,
      availability: tech.availability,
    }));
  }

  async getAvailability(id: string, startDate: string, endDate: string) {
    const technician = this.technicians.find(tech => tech._id === id);
    
    if (!technician) {
      throw new NotFoundException(`Technician with ID ${id} not found`);
    }
    
    // In a real implementation, this would query a database to find
    // actual available slots based on the technician's schedule and
    // existing appointments
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Mock implementation - generate availability for each day in the range
    const availableSlots = [];
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      // Get the day of week as lowercase string (monday, tuesday, etc.)
      const dayOfWeekNumber = currentDate.getDay();
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayOfWeek = days[dayOfWeekNumber];
      
      const dayAvailability = technician.availability[dayOfWeek];
      
      if (dayAvailability.start && dayAvailability.end) {
        // If technician works on this day, add slots
        const startHour = parseInt(dayAvailability.start.split(':')[0]);
        const endHour = parseInt(dayAvailability.end.split(':')[0]);
        
        for (let hour = startHour; hour < endHour; hour++) {
          availableSlots.push({
            date: new Date(currentDate).toISOString().split('T')[0],
            startTime: `${hour.toString().padStart(2, '0')}:00`,
            endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
            technicianId: technician._id,
            technicianName: technician.name,
          });
        }
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return availableSlots;
  }
} 