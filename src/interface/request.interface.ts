import { Request } from '@nestjs/common';

interface IRequest extends Request {
  user: {
    id: number;
    // другие свойства
  };
}
