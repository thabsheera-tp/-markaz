import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { verifyAuth, checkRole } from '@/lib/auth';

const uploadsDir = path.resolve(process.cwd(), 'public/uploads');

export async function POST(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const roleErr = checkRole(auth.user, ['admin', 'editor']);
    if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

    const formData = await req.formData();
    const file = formData.get('image');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No image file uploaded.' }, { status: 400 });
    }

    const originalName = file.name || 'image.jpg';
    const ext = path.extname(originalName).toLowerCase() || '.jpg';
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'];

    if (!allowed.includes(ext)) {
      return NextResponse.json({ error: 'Only image files (JPEG, PNG, WebP, SVG, GIF) are allowed.' }, { status: 400 });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `upload-${uniqueSuffix}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const url = `/uploads/${filename}`;

    return NextResponse.json({
      message: 'Image uploaded successfully.',
      url,
      file: {
        url,
        filename,
        size: buffer.length
      },
      filename,
      size: buffer.length
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Failed to upload image.' }, { status: 500 });
  }
}
