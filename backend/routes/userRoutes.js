import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/").post(registerUser).get(getUsers);

//only 1 method - we can write 'post' instead of 'route' and then function in the (, )
router.post("/logout", logoutUser);

router.post("/login", authUser);

router.route("/profile").get(getUserProfile).put(updateUserProfile);

router.route("/:id").get(getUserById).delete(deleteUser).put(updateUser);

export default router;
