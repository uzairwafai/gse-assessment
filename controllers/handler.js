const { Contact } = require("../models/model");
const { Op } = require("sequelize");

const get = async (req, res) => {
  const result = await Contact.findAll();
  res.json({ results: result });
};
const resolveContact = async (req, res) => {
  const { email, phone } = req.body;

  if (!email || !phone) {
    return res.status(400).json({ error: "Enter both emailID and phone" });
  }
  try {
    // Finding the matching rows based on mail or phone
    const matches = await Contact.findAll({
      where: {
        [Op.or]: [{ email }, { phone }],
      },
    });

    // If there is no match then create a new contact
    if (matches.length === 0) {
      const newContact = await Contact.create({
        email,
        phone,
        isPrimary: true,
      });
      return res.json({
        contactIds: [newContact.id],
        emails: [newContact.email],
        phones: [newContact.phone],
      });
    }

    //// Since some matches were found so we check for those matched records and add them as related
    const allContactIds = new Set(); // is used to contain unique contactIDs
    const contactMap = new Map(); // on the basis of contactID's(keys in map) we associate their data(mail and phone )

    const recursiveRelationfind = async (contact) => {
      if (allContactIds.has(contact.id)) return; // don't process the same contact again(Serves as base condition for recursive logic)

      allContactIds.add(contact.id);
      contactMap.set(contact.id, {
        email: contact.email,
        phone: contact.phone,
      });

      const relatedContacts = await Contact.findAll({
        where: {
          [Op.or]: [{ email: contact.email }, { phone: contact.phone }],
        },
      });

      for (const related of relatedContacts) {
        if (!allContactIds.has(related.id)) {
          await recursiveRelationfind(related);
        }
      }
    };

    // here we call the recursive logic to get all related contacts for all matched records
    for (const contact of matches) {
      await recursiveRelationfind(contact);
    }

    //creating unique set of emails that we added above in contactMap
    const existingEmails = new Set(
      [...contactMap.values()].map((entry) => entry.email)
    );
    // similarly for phone
    const existingPhones = new Set(
      [...contactMap.values()].map((entry) => entry.phone)
    );
    //here we see if the email and phone passed in the request is already present or not
    const emailExists = existingEmails.has(email);
    const phoneExists = existingPhones.has(phone);
    //if any of them is not present then create a new record
    if (!emailExists || !phoneExists) {
      const newContact = await Contact.create({
        email,
        phone,
        isPrimary: false,
      });
      allContactIds.add(newContact.id); //we need to manually add to allContactIds as this was not handled in recursive logic
      contactMap.set(newContact.id, {
        email: newContact.email,
        phone: newContact.phone,
      });
    }

    //sort the ids as first one will be the primary
    const sortedIds = [...allContactIds].sort();

    // here we get the use of contactMap as based on ids we get emails is that very order
    const uniqueEmails = [
      ...new Set(sortedIds.map((id) => contactMap.get(id).email)),
    ];
    const uniquePhones = [
      ...new Set(sortedIds.map((id) => contactMap.get(id).phone)),
    ];

    const response = {
      contactIds: sortedIds,
      emails: uniqueEmails,
      phones: uniquePhones,
    };

    res.json(response);
  } catch {
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

module.exports = { get, resolveContact };
