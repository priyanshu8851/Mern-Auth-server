const express = require('express');
const mongoose = require('mongoose');
const EmployeeModel = require("../models/Employee");
const logger = require("../logger");

const hello = async (req, res) => {
  logger.info("Hello API called");
  res.status(200).json({
    msg: "Hello from Auth API"
  });
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExist = await EmployeeModel.findOne({ email });

    if (userExist) {
      logger.warn(`Registration failed: Email already exists - ${email}`);
      return res.status(400).json({ msg: "Email Already Exists" });
    }

    const createdUser = await EmployeeModel.create({ username, email, password });

    logger.info(`User registered successfully with email: ${email}`);

    res.status(201).json({
      msg: `Account created with email : ${email}`,
      token: await createdUser.generateToken(),
      userId: createdUser._id.toString()
    });
  } catch (err) {
    logger.error(`Registration Error: ${err.message}`);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await EmployeeModel.findOne({ email });

    if (!userExist) {
      logger.warn(`Login failed: Email not found - ${email}`);
      return res.status(400).json({
        msg: "Invalid Credentials"
      });
    }

    const isPasswordValid = await userExist.comparePassword(password);

    if (isPasswordValid) {
      logger.info(`User logged in successfully - ${email}`);
      res.status(200).json({
        msg: `Login Successful`,
        token: await userExist.generateToken(),
        userId: userExist._id.toString()
      });
    } else {
      logger.warn(`Login failed: Incorrect password for email - ${email}`);
      res.status(400).json({ error: "Invalid Password" });
    }
  } catch (error) {
    logger.error(`Login Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const user = async (req, res) => {
  try {
    const userData = req.user;
    logger.info(`Fetched user data for userId: ${userData._id}`);
    return res.status(200).json(userData);
  } catch (error) {
    logger.error(`Error fetching user data: ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = { hello, register, login, user};