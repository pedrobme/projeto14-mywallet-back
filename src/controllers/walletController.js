import dayjs from "dayjs";
import { sessionsCollection, walletCollection } from "../app.js";
import { entriesSchema } from "../assets/joiSchemas.js";

export const insertEntry = async (req, res) => {
  const entryObject = req.body;
  let authToken = req.headers.authorization;

  if (authToken) {
    authToken = authToken.split(" ")[1];
  }

  try {
    const userSession = await sessionsCollection.findOne({
      authToken: authToken,
    });

    if (!userSession) {
      res.status(500).send("Sessão não encontrada, por favor refaça o login");
      return;
    }

    const validation = entriesSchema.validate(entryObject, {
      abortEarly: false,
    });

    if (validation.error) {
      const errors = validation.error.details.map((detail) => detail.message);
      res.status(422).send(errors);
      return;
    }

    const newEntry = {
      ...entryObject,
      date: dayjs().format("DD/MM"),
      userId: userSession.userId,
    };

    await walletCollection.insertOne(newEntry);

    res.status(201).send(newEntry);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getWalletData = async (req, res) => {
  const authToken = req.headers.authorization.split(" ")[1];

  try {
    const userSession = await sessionsCollection.findOne({
      authToken: authToken,
    });

    if (!userSession) {
      res.status(500).send("Sessão não encontrada, por favor refaça o login");
      return;
    }

    const userId = userSession.userId;

    const userWalletData = await walletCollection
      .find({ userId: userId })
      .toArray();

    res.status(200).send(userWalletData);
  } catch (error) {
    res.status(500).send(error);
  }
};
