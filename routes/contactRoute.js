const express = require("express");
const router = express.Router();
const {
  getContacts,
  createContact,
  getContactsByID,
  UpdateContact,
  DeleteContact,
} = require("../controllers/contactController");
const validateToken = require('../middleware/validateTokenHandler')
router.use(validateToken);
router.route("/").get(getContacts);
router.route("/:id").get(getContactsByID);
router.route("/").post(createContact);
router.route("/:id").put(UpdateContact);
router.route("/:id").delete(DeleteContact);

module.exports = router;
