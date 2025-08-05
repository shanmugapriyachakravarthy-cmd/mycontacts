const asyncHandler = require("express-async-handler"); // we dont need seperate try catch block, simply wrap the function with async handler
const Contact = require("../models/contactModel");
//@desc Get all contact
//@route GET api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
  const contact = await Contact.find({ user_id: req.user_id });
  res.status(200).json(contact);
});

//@desc create all contact
//@route POST api/contacts
//@access private
//When we create a new API request always 201 status cod
const createContact = asyncHandler(async (req, res) => {
  console.log("req.body", req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All feilds are mandatory");
  }
  const contact = await Contact.create({
    name, // use can also use like this name : req.body.name---> I am using es6 destructuring property. name matched I can
    email, // call directly
    phone,
  });
  res.status(201).json(contact);
});

//@desc Get contact by Id
//@route GET api/contacts/:id
//@access private
const getContactsByID = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(contact);
});

//@desc Update contacts
//@route UPDATE api/contacts/:id
//@access private
const UpdateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  if (contact.user_id.toString() !== req.user_id) {
    res.status(403);
    throw new Error("User dont have permission to update other contacts");
  }

  const updteContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updteContact);
});

//@desc Get all contact
//@route DELETE api/contacts/:id
//@access private
const DeleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  if (contact.user_id.toString() !== req.user_id) {
    res.status(403);
    throw new Error("User dont have persmission to delete other contacts");
  }
  await Contact.deleteOne({ _id: req.params.id });

  res.status(200).json(contact);
});

module.exports = {
  getContacts,
  createContact,
  getContactsByID,
  UpdateContact,
  DeleteContact,
};
