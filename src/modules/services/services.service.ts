import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ServicesService {
  // Mock data for demonstration purposes
  private services = [
    {
      _id: '1',
      name: 'Oil Change',
      description: 'Standard oil change service with filter replacement.',
      price: 49.99,
      estimatedTime: 30, // minutes
      tags: ['maintenance', 'essential'],
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
    {
      _id: '2',
      name: 'Tire Rotation',
      description: 'Rotate tires to ensure even wear and extend tire life.',
      price: 29.99,
      estimatedTime: 20, // minutes
      tags: ['maintenance', 'tires'],
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
    {
      _id: '3',
      name: 'Brake Inspection',
      description: 'Comprehensive brake system inspection and adjustment.',
      price: 39.99,
      estimatedTime: 45, // minutes
      tags: ['maintenance', 'safety', 'brakes'],
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
    {
      _id: '4',
      name: 'Battery Check',
      description: 'Test battery condition and charging system.',
      price: 19.99,
      estimatedTime: 15, // minutes
      tags: ['maintenance', 'electrical'],
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
    {
      _id: '5',
      name: 'AC Service',
      description: 'Air conditioning system check and recharge.',
      price: 89.99,
      estimatedTime: 60, // minutes
      tags: ['comfort', 'seasonal'],
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
  ];

  private packages = [
    {
      _id: '1',
      name: 'Basic Service Package',
      description: 'Essential maintenance for your vehicle.',
      services: [
        { serviceId: '1', isIncluded: true }, // Oil Change
        { serviceId: '2', isIncluded: true }, // Tire Rotation
        { serviceId: '4', isIncluded: true }, // Battery Check
      ],
      totalPrice: 89.99, // Discounted from individual prices
      estimatedTime: 60, // minutes
      tags: ['maintenance', 'essential', 'value'],
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
    {
      _id: '2',
      name: 'Comprehensive Service Package',
      description: 'Complete vehicle maintenance and safety check.',
      services: [
        { serviceId: '1', isIncluded: true }, // Oil Change
        { serviceId: '2', isIncluded: true }, // Tire Rotation
        { serviceId: '3', isIncluded: true }, // Brake Inspection
        { serviceId: '4', isIncluded: true }, // Battery Check
        { serviceId: '5', isIncluded: false }, // AC Service (optional)
      ],
      totalPrice: 129.99, // Discounted from individual prices
      estimatedTime: 110, // minutes
      tags: ['maintenance', 'safety', 'value'],
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
    {
      _id: '3',
      name: 'Summer Ready Package',
      description: 'Prepare your vehicle for summer driving.',
      services: [
        { serviceId: '1', isIncluded: true }, // Oil Change
        { serviceId: '2', isIncluded: true }, // Tire Rotation
        { serviceId: '4', isIncluded: true }, // Battery Check
        { serviceId: '5', isIncluded: true }, // AC Service
      ],
      totalPrice: 169.99, // Discounted from individual prices
      estimatedTime: 120, // minutes
      tags: ['seasonal', 'comfort', 'summer'],
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
  ];

  private allTags = [
    'maintenance', 
    'essential', 
    'tires', 
    'safety', 
    'brakes', 
    'electrical', 
    'comfort', 
    'seasonal', 
    'value', 
    'summer'
  ];

  async getPackages(search?: string, tag?: string) {
    let filteredPackages = [...this.packages];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPackages = filteredPackages.filter(
        pkg => pkg.name.toLowerCase().includes(searchLower) || 
              pkg.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (tag) {
      filteredPackages = filteredPackages.filter(
        pkg => pkg.tags.includes(tag)
      );
    }
    
    return filteredPackages.map(pkg => {
      const includedServices = pkg.services
        .filter(s => s.isIncluded)
        .map(s => {
          const service = this.services.find(
            service => service._id === s.serviceId
          );
          return {
            _id: service._id,
            name: service.name,
            price: service.price,
            estimatedTime: service.estimatedTime,
          };
        });
      
      return {
        _id: pkg._id,
        name: pkg.name,
        description: pkg.description,
        totalPrice: pkg.totalPrice,
        estimatedTime: pkg.estimatedTime,
        tags: pkg.tags,
        services: includedServices,
      };
    });
  }

  async getPackage(id: string) {
    const pkg = this.packages.find(p => p._id === id);
    
    if (!pkg) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }
    
    const servicesDetails = pkg.services.map(s => {
      const service = this.services.find(
        service => service._id === s.serviceId
      );
      return {
        _id: service._id,
        name: service.name,
        description: service.description,
        price: service.price,
        estimatedTime: service.estimatedTime,
        isIncluded: s.isIncluded,
        tags: service.tags,
      };
    });
    
    return {
      _id: pkg._id,
      name: pkg.name,
      description: pkg.description,
      totalPrice: pkg.totalPrice,
      estimatedTime: pkg.estimatedTime,
      tags: pkg.tags,
      services: servicesDetails,
    };
  }

  async getServices(search?: string, tag?: string) {
    let filteredServices = [...this.services];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredServices = filteredServices.filter(
        service => service.name.toLowerCase().includes(searchLower) || 
                 service.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (tag) {
      filteredServices = filteredServices.filter(
        service => service.tags.includes(tag)
      );
    }
    
    return filteredServices.map(service => ({
      _id: service._id,
      name: service.name,
      description: service.description,
      price: service.price,
      estimatedTime: service.estimatedTime,
      tags: service.tags,
    }));
  }

  async getTags() {
    return this.allTags;
  }
} 