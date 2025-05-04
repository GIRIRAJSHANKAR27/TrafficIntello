import { Router } from "express";
const router = Router();
import  publishSignalState from "../redis/publisher.js";

router.post("/update", async (req, res) => {
  const { junctionId, signalState } = req.body;
  if (!junctionId || !signalState) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  await publishSignalState(junctionId, signalState);
  res.json({ status: "Published" });
});

export default router;
