// controllers/userController.js
import User from "../models/User.js";

// CREATE
export const createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
};

// GET ALL
export const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// GET ONE
export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
};

// UPDATE
export const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
};

// DELETE
export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};