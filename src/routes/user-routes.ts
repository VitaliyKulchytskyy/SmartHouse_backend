import { handleFetchListOfUsers, handleGetUser, handleUserSignIn, handleUserSignUp } from '@/controller/user-controller';
import { authenticate } from '@/middlewares/auth';
import { createRouter } from '@/utils/create';
import { Router } from 'express';


export default createRouter((router: Router) => {
    router.get("/list", authenticate(), handleFetchListOfUsers);
    router.get("/validate", authenticate(), handleGetUser);
    router.post("/signup", handleUserSignUp);
    router.post("/signin", handleUserSignIn);
});