import { v4 as uuid } from "uuid";
import { sessionsCollection, usersCollection } from "../app.js";
import { signinSchema, signupSchema } from "../assets/joiSchemas.js";
import bcrypt from "bcrypt";

export const trySignin = async (req, res) => {
  const informedUser = req.body;

  const validation = signinSchema.validate(informedUser, {
    abortEarly: false,
  });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    res.status(422).send(errors);
    return;
  }

  try {
    const userDetails = await usersCollection.findOne({
      email: informedUser.email,
    });

    if (!userDetails) {
      res.status(422).send(["Email is not registered"]);
    } else {
      bcrypt.compare(
        req.body.password,
        userDetails.password,
        async (bcrypterr, bcryptres) => {
          if (bcrypterr) {
            res.sendStatus(500);
            return;
          }

          if (bcryptres) {
            const sessionToken = uuid();

            await sessionsCollection.insertOne({
              userId: userDetails._id,
              authToken: sessionToken,
            });

            res.status(200).send({
              authToken: sessionToken,
              username: userDetails.username,
            });
          } else {
            res.status(422).send(["Wrong password"]);
            return;
          }
        }
      );
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

export const trySignup = async (req, res) => {
  const newUser = req.body;

  const validation = signupSchema.validate(newUser, {
    abortEarly: false,
  });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    res.status(422).send(errors);
    return;
  }

  try {
    const emailAlreadyInUse = await usersCollection.findOne({
      email: newUser.email,
    });
    if (emailAlreadyInUse) {
      res.status(422).send(["Email already in use"]);
      return;
    }
  } catch (error) {
    res.send(400);
  }

  const encryptedPassword = bcrypt.hashSync(newUser.password, 12);
  delete newUser.confirmPassword;
  const newUserObject = { ...newUser, password: encryptedPassword };

  res.status(200).send(newUserObject);
  try {
    await usersCollection.insertOne(newUserObject);
  } catch (error) {
    res.status(400).send(error);
  }
};
