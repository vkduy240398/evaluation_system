import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private limiter;

  constructor() {
    this.limiter = rateLimit({
      windowMs: 10 * 60 * 1000, 
      max: 5, 
      message: 'Too many login attempts, please try again later.', 
      skipSuccessfulRequests: true,
      keyGenerator: (req: any) => req.get('x-forwarded-for'),
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.limiter(req, res, next);
  }
}
