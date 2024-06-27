import { User } from './entities/user.entity';
import { DataSource } from 'typeorm';
import {config} from 'dotenv';

config();

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
} = process.env;

export const databaseProviders = [
{
    provide: DataSource, // add the datasource as a provider
    inject: [],
    useFactory: async () => {
      // using the factory function to create the datasource instance
      const dataSource = new DataSource({
        type: 'postgres',
        host: DB_HOST,
        port: parseInt(DB_PORT,10),
        username: DB_USER,
        password: DB_PASSWORD,
        synchronize: true,
        entities: [User], // this will automatically load all entity file in the src folder
      });

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