import express from "express";
import { supabase, supabaseBucket } from "../config/supabase.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    env: process.env.NODE_ENV,
  });
});

router.get("/storage", async (req, res) => {
  try {
    const { error } = await supabase.storage.from(supabaseBucket).list("", {
      limit: 1,
    });
    if (error) throw error;
    return res.json({
      success: true,
      storage: "available",
      bucket: supabaseBucket,
    });
  } catch (error) {
    return res.status(503).json({
      success: false,
      storage: "unavailable",
      bucket: supabaseBucket,
      message: "Storage configuration is unavailable",
    });
  }
});

export default router;
