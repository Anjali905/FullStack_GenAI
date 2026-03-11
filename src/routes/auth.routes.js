const {Router} = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authRouter= Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
 authRouter.post('/register',authController.registerUserController)

 /**
  * @route POST /api/auth/login
  * @desc Login a user with email and password
  * @access Public
  */
 authRouter.post('/login',authController.loginUserController)

 /**
  * @route POST /api/auth/logout
  * @desc Logout a user by clearing the token cookie
  * @access Public
  */
 authRouter.get('/logout',authController.logoutUserController)
  
 /**
  * @router GET/api/auth/get-me
  * @desc Get user details
  * @access Private
  */
authRouter.get('/get-me', authMiddleware.authUser,authController.getMeController);
module.exports = authRouter;
