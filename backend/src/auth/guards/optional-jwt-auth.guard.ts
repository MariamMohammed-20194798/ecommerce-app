/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * OptionalJwtAuthGuard
 *
 * Unlike the standard JwtAuthGuard which rejects unauthenticated requests,
 * this guard allows both authenticated and guest (unauthenticated) requests.
 *
 * If a valid JWT is present → req.user is populated.
 * If no JWT (or invalid) → req.user is undefined, request continues normally.
 *
 * Used for cart endpoints where both guests and logged-in users can interact.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // Override to swallow auth errors — guests just get req.user = undefined
  handleRequest(_err: any, user: any) {
    return user ?? null;
  }
}
