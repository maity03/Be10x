import Fund from "../models/fundModel.js";

// Save a mutual fund for a user
export const saveFund = async (req, res) => {
  try {
    const { fundId, fundName } = req.body;
    const userEmail = req.user.email;
    if (!userEmail || !fundId || !fundName) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const existing = await Fund.findOne({ userEmail, fundId });
    if (existing) {
      return res.status(409).json({ message: "Fund already saved" });
    }
    const fund = await Fund.create({ userEmail, fundId, fundName });
    res.status(201).json({ message: "Fund saved", fund });
  } catch (error) {
    console.error("Save fund error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all saved funds for a user
export const getSavedFunds = async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ message: "Missing userEmail" });
    }
    const funds = await Fund.find({ userEmail });
    res.status(200).json({ funds });
  } catch (error) {
    console.error("Get saved funds error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove a saved fund for a user
export const removeFund = async (req, res) => {
  try {
    const { fundId } = req.body;
    const userEmail = req.user.email;
    if (!userEmail || !fundId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const result = await Fund.findOneAndDelete({ userEmail, fundId });
    if (!result) {
      return res.status(404).json({ message: "Fund not found" });
    }
    res.status(200).json({ message: "Fund removed" });
  } catch (error) {
    console.error("Remove fund error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
