import { getUserByUserId } from '@/services/user-services';
import { createHandler } from '@/utils/create';
import { BackendError } from '@/utils/errors';
import { verifyToken } from '@/utils/jwt';


export function authenticate() {
  return createHandler(async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new BackendError('UNAUTHORIZED', {
        message: 'Authorization header not found',
      });
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      throw new BackendError('UNAUTHORIZED', {
        message: 'Token not found',
      });
    }

    const { userId } = verifyToken(token);
    const user = await getUserByUserId(userId);

    if (!user)
      throw new BackendError('USER_NOT_FOUND');

    res.locals.user = user;
    next();
  });
}