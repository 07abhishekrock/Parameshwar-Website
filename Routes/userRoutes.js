const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post('/nonadmin',userController.addNonAdminUser);
router.get('/',userController.getPaginatedUsers);
router.get('/adminList',userController.getAdmin);

router.post("/signup" ,authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post('/changePassword',authController.protect,authController.updatePassword);
router.delete('/:id',userController.deleteUser);

module.exports = router;
