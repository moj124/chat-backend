import { DataSource } from 'typeorm';
import dataSource from './dataSource';

export const databaseProviders = [
{
    provide: DataSource, // add the datasource as a provider
    inject: [],
    useFactory: async () => {
      try {
        await dataSource.initialize(); // initialize the data source
        console.log('Database connected successfully');
        return dataSource;
      } catch (error) {
        console.log('Error connecting to database');
        throw error;
      }
    },
  },
];