import { ArgumentsHost, Catch, UnauthorizedException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(UnauthorizedException)
export class AuthorizationExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const contextType = host.getType();

    if (contextType === 'ws') {
      const client: Socket = host.switchToWs().getClient();
      client.emit('process', { statusCode: 401, message: 'Unauthorized' });
    } else {
      response.status(401).json({ statusCode: 401, message: 'Unauthorized' });
    }
  }
}
