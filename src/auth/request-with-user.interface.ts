import User from '../users/entities/user.entity';
import { Request } from '@nestjs/common';
export interface RequestWithUser extends Request {
  user: User;
}
