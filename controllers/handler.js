const { sequelize, Contact } = require("../models/model");

const get = async (req, res) => {
  const result = await Contact.findAll();
  res.json({ results: result });
};

const resolveContact = async (req, res) => {
  //   const body = req.body;
  //   console.log(body);
  //   contacts.push(body);
  //   res.status(201);
  //   res.send("Created");
  const { email, phone } = req.body;

  if (!email || !phone) {
    return res.status(400).json({
      error: "Enter valid email and phone.",
    });
  } else {
    try {
        //Todo
      const newContact = await Contact.create({ email, phone });
      res.json({ newContact });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = { get, resolveContact };
