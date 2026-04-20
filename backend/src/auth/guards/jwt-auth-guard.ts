import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()

// Blocks requests without valid token
export class JwtAuthGuard extends AuthGuard('jwt') {}
