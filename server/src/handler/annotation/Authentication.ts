import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Allow a route can be executed without being authenticated.
 *
 * @author tran.le.ha.nam
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
