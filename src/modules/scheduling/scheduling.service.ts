import { Injectable } from '@nestjs/common';

@Injectable()
export class SchedulingService {
  // Mock service data for demonstration
  private services = [
    { _id: '1', estimatedTime: 30 }, // Oil Change - 30 min
    { _id: '2', estimatedTime: 20 }, // Tire Rotation - 20 min
    { _id: '3', estimatedTime: 45 }, // Brake Inspection - 45 min
    { _id: '4', estimatedTime: 15 }, // Battery Check - 15 min
    { _id: '5', estimatedTime: 60 }, // AC Service - 60 min
  ];

  // In a real implementation, this would query a database to find
  // actual available slots based on technicians' schedules and
  // existing appointments
  async getAvailableSlots(date: string, serviceIds: string[]) {
    // Calculate total time needed for selected services
    const totalTime = this.calculateTotalTime(serviceIds);
    
    // Generate available time slots for the given date
    const slots = [];
    const startHour = 8; // 8 AM
    const endHour = 17; // 5 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // In a real implementation, would check if this slot is available
        // based on existing appointments
        const isAvailable = true; // Mocked as always available
        
        if (isAvailable) {
          slots.push({
            date,
            startTime,
            durationMinutes: totalTime,
          });
        }
      }
    }
    
    return slots;
  }

  async calculateEndTime(startDate: string, startTime: string, serviceIds: string[]) {
    const totalMinutes = this.calculateTotalTime(serviceIds);
    
    // Parse start date and time
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const startDateTime = new Date(startDate);
    startDateTime.setHours(startHour, startMinute, 0, 0);
    
    // Add total minutes to get end time
    const endDateTime = new Date(startDateTime.getTime() + totalMinutes * 60000);
    
    return {
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
      durationMinutes: totalMinutes,
    };
  }

  private calculateTotalTime(serviceIds: string[]): number {
    if (!serviceIds.length) {
      return 0;
    }
    
    // Sum up estimated time for all selected services
    return serviceIds.reduce((total, serviceId) => {
      const service = this.services.find(s => s._id === serviceId);
      return total + (service ? service.estimatedTime : 0);
    }, 0);
  }
} 