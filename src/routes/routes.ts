import type { Router } from 'express';
import userRoutes from '@/routes/user-routes';
import { createRouter } from '@/utils/create';


export default createRouter((router: Router) => {
  router.use('/user', userRoutes);
});