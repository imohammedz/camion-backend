const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

//Post a driver
router.post("/", auth(["FLEET_OWNER"]), async (req, res) => {
  try {
    // Generate a unique registerId dynamically
    const randomNumber = Math.floor(10000 + Math.random() * 90000); // Generates a random 5-digit number
    const newRegisterId = `DVR-${randomNumber}`;

    const driver = await prisma.driver.create({
      data: {
        ...req.body, 
        registerId: newRegisterId, 
      },
    });

    res.status(201).json(driver);
  } catch (err) {
    console.error("Error creating driver:", err);
    res.status(500).json({ error: err.message });
  }
});

//update a driver by Id
router.put("/:id", auth(["FLEET_OWNER"]), async (req, res) => {
  try {
    const driver = await prisma.driver.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(driver);
  } catch (err) {
    console.error("Error updating driver:", err);
    res.status(500).json({ error: err.message });
  }
});


//delete a driver by Id
router.delete("/:id", auth(["FLEET_OWNER"]), async (req, res) => {
  try {
    const driver = await prisma.driver.delete({
      where: { id: req.params.id },
    });

    res.json(driver);
  } catch (err) {
    console.error("Error deleting driver:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
