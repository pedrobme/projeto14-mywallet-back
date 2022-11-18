import Joi from "joi";

export const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const signupSchema = Joi.object({
  username: Joi.string().min(3).max(15).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.ref("password"),
});

export const entriesSchema = Joi.object({
  amount: Joi.number().required(),
  description: Joi.string().required(),
  type: Joi.string().valid("gain", "loss").required(),
});
