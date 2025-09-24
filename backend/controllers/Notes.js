const prisma = require("../shortcut/prisma_initilization");
const getDate = require("../utils/usefulFunction/returnDate");
const FetchAllNotes = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies || !cookies.jwt) {
    console.log("Missing Important cookies");
    return res.status(404).json({ message: "Missing Important cookies" });
  }
  try {
    const validUser = await prisma.users.findUnique({
      where: { reference_token: cookies.jwt },
    });
    if (!validUser) {
      return res.status(401).json({
        message:
          "You are not member of NoteNest, Please Sign In to move forward",
      });
    }

    const ifAdmin = async () => {
      try {
        const allUserNotes = await prisma.notes.findMany();
        if (!allUserNotes) {
          console.log("Failed to fetch Notes");
          return res.status(400).json({ message: "Failed to fetch Notes" });
        }
        console.log("Successfully fetched Notes");
        return res
          .status(200)
          .json({ message: "Successfully fetched Notes", notes: allUserNotes });
      } catch (error) {
        console.log("DB Error : ", error);
        return res.status(503).json({ message: `DB Error : ${error.message}` });
      }
    };
    const ifUser = async () => {
      try {
        const allNotes = await prisma.notes.findMany({
          where: { email: validUser.email },
        });
        if (!allNotes) {
          console.log("Failed to fetch Notes");
          return res.status(400).json({ message: "Failed to fetch Notes" });
        }
        if (allNotes.length === 0) {
          console.log("No, Notes Found");
          return res.status(404).json({ message: "No, Notes Found" });
        }
        console.log("Successfully fetched Notes");
        return res.status(200).json({
          message: "Successfully fetched Notes",
          notes: allNotes,
        });
      } catch (error) {
        console.log("DB Error : ", error);
        return res.status(503).json({ message: `DB Error : ${error.message}` });
      }
    };

    validUser.role === "admin"
      ? ifAdmin()
      : validUser.role === "user"
      ? ifUser()
      : () => {
          return res.status(401).json({ message: "Your Role is Invalid" });
        };
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
const PostNotes = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    console.log("Missing Important cookies");
    return res.status(404).json({ message: "Missing Important cookies" });
  }
  try {
    const validUser = await prisma.users.findUnique({
      where: { reference_token: cookies.jwt },
    });
    if (!validUser) {
      return res.status(401).json({
        message:
          "You are not member of NoteNest, Please Sign In to move forward",
      });
    }
    const ifAdmin = async () => {
      const { postDetails, email } = req.body;
      if (!postDetails || !email) {
        return res.status(404).json({ message: "Missing Important Data" });
      }
      try {
        const newNote = {
          email: email,
          created_at: getDate(0),
          title: postDetails.title,
          body: postDetails.body,
        };
        const postNote = await prisma.notes.create({
          data: newNote,
        });
        if (!postNote) {
          console.log("Failed to post Note");
          return res.status(400).json({ message: "Failed to post Note" });
        }
        console.log("Successfully posted Notes");
        return res.status(200).json({ message: "Successfully posted Notes" });
      } catch (error) {
        console.log("DB Error : ", error);
        return res.status(503).json({ message: `DB Error : ${error.message}` });
      }
    };
    const ifUser = async () => {
      const { postDetails } = req.body;
      if (!postDetails) {
        return res.status(404).json({ message: "Missing Important Data" });
      }
      try {
        const newNote = {
          email: validUser.email,
          created_at: getDate(0),
          title: postDetails.title,
          body: postDetails.body,
        };
        const postNote = await prisma.notes.create({
          data: newNote,
        });
        if (!postNote) {
          console.log("Failed to post Note");
          return res.status(400).json({ message: "Failed to post Note" });
        }
        console.log("Successfully posted Notes");
        return res.status(200).json({ message: "Successfully posted Notes" });
      } catch (error) {
        console.log("DB Error : ", error);
        return res.status(503).json({ message: `DB Error : ${error.message}` });
      }
    };
    validUser.role === "admin"
      ? ifAdmin()
      : validUser.role === "user"
      ? ifUser()
      : () => {
          return res.status(401).json({ message: "Your Role is Invalid" });
        };
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
const UpdateNotes = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    console.log("Missing Important cookies");
    return res.status(404).json({ message: "Missing Important cookies" });
  }
  try {
    const validUser = await prisma.users.findUnique({
      where: { reference_token: cookies.jwt },
    });
    if (!validUser) {
      return res.status(401).json({
        message:
          "You are not member of NoteNest, Please Sign In to move forward",
      });
    }
    const ifAdmin = async () => {
      const { postDetails, email, id } = req.body;
      if (!postDetails || !email || id) {
        return res.status(404).json({ message: "Missing Important Data" });
      }
      try {
        const updatedNote = {
          created_at: getDate(0),
          title: postDetails.title,
          body: postDetails.body,
        };
        const updateNote = await prisma.notes.update({
          where: { id: id, email: email },
          data: updatedNote,
        });
        if (!updateNote) {
          console.log("Failed to update Note");
          return res.status(400).json({ message: "Failed to update Note" });
        }
        console.log("Successfully updated Notes");
        return res.status(200).json({ message: "Successfully updated Notes" });
      } catch (error) {
        console.log("DB Error : ", error);
        return res.status(503).json({ message: `DB Error : ${error.message}` });
      }
    };
    const ifUser = async () => {
      const { postDetails, id } = req.body;
      if (!postDetails || !id) {
        return res.status(404).json({ message: "Missing Important Data" });
      }
      try {
        const updatedNote = {
          created_at: getDate(0),
          title: postDetails.title,
          body: postDetails.body,
        };
        const updateNote = await prisma.notes.update({
          where: { id: id, email: validUser.email },
          data: updatedNote,
        });
        if (!updateNote) {
          console.log("Failed to update Note");
          return res.status(400).json({ message: "Failed to update Note" });
        }
        console.log("Successfully updated Notes");
        return res.status(200).json({ message: "Successfully updated Notes" });
      } catch (error) {
        console.log("DB Error : ", error);
        return res.status(503).json({ message: `DB Error : ${error.message}` });
      }
    };
    validUser.role === "admin"
      ? ifAdmin()
      : validUser.role === "user"
      ? ifUser()
      : () => {
          return res.status(401).json({ message: "Your Role is Invalid" });
        };
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
const DeleteNotes = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    console.log("Missing Important cookies");
    return res.status(404).json({ message: "Missing Important cookies" });
  }
  try {
    const validUser = await prisma.users.findUnique({
      where: { reference_token: cookies.jwt },
    });
    if (!validUser) {
      return res.status(401).json({
        message:
          "You are not member of NoteNest, Please Sign In to move forward",
      });
    }
    const { id } = req.body;
    if (!id) {
      return res.status(404).json({ message: "Missing Important Data" });
    }
    try {
      const deleteNote = await prisma.notes.delete({ where: { id: id } });
      if (!deleteNote) {
        console.log("Failed to delete Note");
        return res.status(400).json({ message: "Failed to delete Note" });
      }
      console.log("Successfully deleted Notes");
      return res.status(200).json({ message: "Successfully deleted Notes" });
    } catch (error) {
      console.log("DB Error : ", error);
      return res.status(503).json({ message: `DB Error : ${error.message}` });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
module.exports = { FetchAllNotes, PostNotes, UpdateNotes, DeleteNotes };
