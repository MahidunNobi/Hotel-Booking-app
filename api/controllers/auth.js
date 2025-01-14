import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { connect } from "../utils/connectDB.js";

export const userRegister = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    await connect();
    const user = await User.create({
      ...req.body,
      password: hash,
    });
    const { password, isAdmin, ...otherDetails } = user._doc;
    res.status(201).json({ ...otherDetails });
  } catch (error) {
    next(error);
  }
};

export const userLogin = async (req, res, next) => {
  try {
    await connect();
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found!"));
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) return next(createError(400, "Wrond Password!"));
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );

    const { password, isAdmin, ...otherDetails } = user._doc;

    res
      .cookie(
        "accessToken",
        token
        //       {
        // expires: new Date(Date.now() + (3600 * 1000 * 24 * 1)),
        //   httpOnly: true,
        // sameSite: "none",
        // secure: "false",
        // }
      )
      .status(200)
      .json({ details: { ...otherDetails }, isAdmin, token });
  } catch (error) {
    next(error);
  }
};
