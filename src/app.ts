import createError,{HttpError} from 'http-errors';
import express, {Request,Response,NextFunction} from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import  logger from 'morgan';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './graphQL/typeDefs';
import { resolvers } from './graphQL/resolvers';
import { connectDatabase } from './config1/database';
import {GraphQLError} from 'graphql'

dotenv.config();
export const app = express();

connectDatabase();


//this function helps to connect to the servers 



app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// app.use('/books', bookRoutes);
// app.use('/users', usersRoutes);


//this is ap

const server = new ApolloServer({
  typeDefs,
  resolvers,
});





(async () =>{
  const { url } = await startStandaloneServer(server);
  console.log(`server ready at ${url}`)
})()


function getUser(token: string) {
  throw new Error('Function not implemented.');
}

// , {
//   context: async ({ req }) => {
//     // get the user token from the headers
//     const token = req.headers.authorization || '';

//     // try to retrieve a user with the token
//     const user:any = getUser(token);

  
//     if (!user)


//       throw new GraphQLError('User is not authenticated', {
//         extensions: {
//           code: 'UNAUTHENTICATED',
//           http: { status: 401 },
//         },
//       });

   
//     return { user };
//   },
// }