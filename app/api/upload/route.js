import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
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
    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. Try uploading to Supabase Storage if configured (Production / Vercel)
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const mimeTypes = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.webp': 'image/webp',
          '.svg': 'image/svg+xml',
          '.gif': 'image/gif'
        };

        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(filename, buffer, {
            contentType: mimeTypes[ext] || file.type || 'image/jpeg',
            upsert: true,
          });

        if (!uploadError) {
          const { data: publicData } = supabase.storage.from('uploads').getPublicUrl(filename);
          const url = publicData.publicUrl;

          return NextResponse.json({
            message: 'Image uploaded successfully.',
            url,
            file: {
              url,
              filename,
              size: buffer.length,
            },
            filename,
            size: buffer.length,
          });
        } else {
          console.warn('Supabase storage upload error, falling back to local:', uploadError.message);
        }
      } catch (storageErr) {
        console.warn('Supabase storage exception, falling back to local:', storageErr);
      }
    }

    // 2. Fallback to local disk (useful for local development)
    if (!existsSync(uploadsDir)) {
      await fs.mkdir(uploadsDir, { recursive: true });
    }
    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, buffer);

    const url = `/uploads/${filename}`;

    return NextResponse.json({
      message: 'Image uploaded successfully.',
      url,
      file: {
        url,
        filename,
        size: buffer.length,
      },
      filename,
      size: buffer.length,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Failed to upload image.' }, { status: 500 });
  }
}
