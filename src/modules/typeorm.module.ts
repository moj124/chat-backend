import { DataSource } from 'typeorm';
import { Global, Module } from '@nestjs/common';
import {config} from 'dotenv';
import { User } from '../entities/user.entity';

config();

const {
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
} = process.env;

@Global() // makes the module available globally for other modules once imported in the app modules
@Module({
  imports: [],
  providers: [
    {
      provide: DataSource, // add the datasource as a provider
      inject: [],
      useFactory: async () => {
        // using the factory function to create the datasource instance
        const dataSource = new DataSource({
          type: 'postgres',
          host: 'localhost',
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
  ],
  exports: [DataSource],
})
export class TypeOrmModule {}