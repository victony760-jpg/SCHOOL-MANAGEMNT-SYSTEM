import multer from "multer";
import path from "path";
import { supabase, supabaseBucket } from "../config/supabase.js";

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const allowedExts = [
      ".jpeg",
      ".jpg",
      ".png",
      ".webp",
      ".pdf",
      ".doc",
      ".docx",
    ];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(
        new Error(`Only images, PDF, DOC, DOCX allowed. Got: ${file.mimetype}`),
        false,
      );
    }
  },
});

export const uploadToSupabase = async (file, folder = "school-students") => {
  if (!file?.buffer) return null;
  const extension = path.extname(file.originalname).toLowerCase();
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage
    .from(supabaseBucket)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });
  if (error) throw error;

  const { data } = supabase.storage.from(supabaseBucket).getPublicUrl(filePath);
  return { url: data.publicUrl, path: filePath };
};

// Helper: extract "folder/file.jpg" from full public URL
export const extractPathFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split(`/${supabaseBucket}/`);
  return parts[1] || null;
};

export const deleteFile = async (filePath) => {
  if (!filePath) return;
  try {
    const { error } = await supabase.storage
      .from(supabaseBucket)
      .remove([filePath]);
    if (error) console.error("Failed to delete Supabase file:", error.message);
  } catch (error) {
    console.error("Failed to delete Supabase file:", error.message);
  }
};
