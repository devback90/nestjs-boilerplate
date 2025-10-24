import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';

import { AppModule } from './app.module';
import { firstValueFrom, ReplaySubject } from 'rxjs';


const serverSubject = new ReplaySubject<Handler>();

async function bootstrap(): Promise<Handler> {
  console.log('COLD START: Initializing Nest');

  const app = await NestFactory.create(AppModule);

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

// Do not wait for lambdaHandler to be called before bootstraping Nest.
// Pass the result of bootstrap() into the ReplaySubject
bootstrap().then((server) => serverSubject.next(server));

type EventPayload = {
  [key: string]: any;
};

export const handler: Handler = async (
  event: EventPayload,
  context: Context,
  callback: Callback,
) => {
  // Handle edge cases for root path
  if (event.path === '' || event.path === undefined) event.path = '/';

  // Convert the ReplaySubject to a Promise.
  // Wait for bootstrap to finish, then start handling requests.
  const server = await firstValueFrom(serverSubject);
  return server(event, context, callback);
};