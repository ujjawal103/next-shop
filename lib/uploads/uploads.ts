import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = process.env.UPLOAD_DIR as string;

if (!UPLOAD_DIR) {
  throw new Error("Please define UPLOAD_DIR in .env.local");
}

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function uploadImage(
  file: File,
  folder: string
) {
  // 1. Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(
      "Only JPG, PNG and WEBP images are allowed"
    );
  }

  // 2. Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image size cannot exceed 5MB");
  }

  // 3. Get extension
  const extension = path.extname(file.name).toLowerCase();

  // 4. Generate unique filename
  const filename = `${crypto.randomUUID()}${extension}`;

  // 5. Create destination folder
  const folderPath = path.join(UPLOAD_DIR, folder);

  await mkdir(folderPath, {
    recursive: true,
  });

  // 6. Convert File → Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 7. Save file
  const filePath = path.join(folderPath, filename);

  await writeFile(filePath, buffer);

  // 8. Return public URL
  const imageUrl = `/uploads/nextshop/${folder}/${filename}`;

  return {
    filename,
    path: filePath,
    url: imageUrl,
  };
}