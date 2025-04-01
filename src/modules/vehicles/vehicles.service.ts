import { Injectable } from '@nestjs/common';
import { IdValueItem } from './types/vehicle.types';

@Injectable()
export class VehiclesService {
  // Mock data for demonstration purposes
  private years = [
    { _id: '1', year: '2022' },
    { _id: '2', year: '2023' },
    { _id: '3', year: '2024' },
  ];

  private makes = [
    { _id: '1', name: 'Toyota', yearIds: ['1', '2', '3'] },
    { _id: '2', name: 'Honda', yearIds: ['1', '2', '3'] },
    { _id: '3', name: 'Ford', yearIds: ['1', '2', '3'] },
    { _id: '4', name: 'Chevrolet', yearIds: ['1', '2', '3'] },
  ];

  private models = [
    { _id: '1', name: 'Corolla', makeId: '1', yearIds: ['1', '2', '3'] },
    { _id: '2', name: 'Camry', makeId: '1', yearIds: ['1', '2', '3'] },
    { _id: '3', name: 'Civic', makeId: '2', yearIds: ['1', '2', '3'] },
    { _id: '4', name: 'Accord', makeId: '2', yearIds: ['1', '2', '3'] },
    { _id: '5', name: 'F-150', makeId: '3', yearIds: ['1', '2', '3'] },
    { _id: '6', name: 'Mustang', makeId: '3', yearIds: ['1', '2', '3'] },
    { _id: '7', name: 'Silverado', makeId: '4', yearIds: ['1', '2', '3'] },
    { _id: '8', name: 'Malibu', makeId: '4', yearIds: ['1', '2', '3'] },
  ];

  private types = [
    { _id: '1', name: 'Sedan' },
    { _id: '2', name: 'SUV' },
    { _id: '3', name: 'Truck' },
    { _id: '4', name: 'Van' },
    { _id: '5', name: 'Coupe' },
    { _id: '6', name: 'Convertible' },
  ];

  async getYears(): Promise<IdValueItem[]> {
    return this.years.map(year => ({
      id: year.year,
      value: year.year
    }));
  }

  async getMakes(year?: string): Promise<IdValueItem[]> {
    if (!year) {
      return this.makes.map(make => ({
        id: make.name,
        value: make.name
      }));
    }
    
    const yearDoc = this.years.find(y => y.year === year);
    if (!yearDoc) {
      return [];
    }
    
    const yearId = yearDoc._id;
    return this.makes
      .filter(make => make.yearIds.includes(yearId))
      .map(make => ({
        id: make.name,
        value: make.name
      }));
  }

  async getModels(year?: string, make?: string): Promise<IdValueItem[]> {
    let filteredModels = [...this.models];
    
    if (year) {
      const yearDoc = this.years.find(y => y.year === year);
      if (yearDoc) {
        const yearId = yearDoc._id;
        filteredModels = filteredModels.filter(model => 
          model.yearIds.includes(yearId)
        );
      }
    }
    
    if (make) {
      const makeDoc = this.makes.find(m => m.name === make);
      if (makeDoc) {
        const makeId = makeDoc._id;
        filteredModels = filteredModels.filter(model => 
          model.makeId === makeId
        );
      }
    }
    
    return filteredModels.map(model => ({
      id: model.name,
      value: model.name
    }));
  }

  async getTypes(): Promise<IdValueItem[]> {
    return this.types.map(type => ({
      id: type.name,
      value: type.name
    }));
  }
} 