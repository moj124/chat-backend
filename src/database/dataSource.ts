import { Conversation } from "../conversation/conversation.entity";
import { Message } from "../message/message.entity";
import { User } from "../user/user.entity";
import { DataSource } from "typeorm";
import { config } from 'dotenv';

config();

const {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
  } = process.env;
  
  
  export const dataSource = new DataSource({
    type: 'postgres',
    host: DB_HOST,
    port: parseInt(DB_PORT,10),
    username: DB_USER,
    password: DB_PASSWORD,
    synchronize: true,
    entities: [User, Message, Conversation],
    migrations: ['./src/database/migrations/*.ts'],
  });