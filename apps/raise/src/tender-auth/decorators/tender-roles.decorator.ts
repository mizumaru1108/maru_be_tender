import { SetMetadata } from '@nestjs/common';


export const TenderRoles = (...type: string[]) => SetMetadata('type', type);
