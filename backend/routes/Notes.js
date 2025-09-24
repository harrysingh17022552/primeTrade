const express = require("express");
const router = express.Router();
const Notes = require("../controllers/Notes");
router.route("/getNotes").get(Notes.FetchAllNotes);
router.route("/postNotes").post(Notes.PostNotes);
router.route("/updateNotes").put(Notes.UpdateNotes);
router.route("/deleteNotes").delete(Notes.DeleteNotes);
module.exports = router;
