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

    // 1. Try uploading to Supabase Storage (Production / Vercel / Cloud CDN)
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qlfaysbmmgspifkovyox.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsZmF5c2JtbWdzcGlma292eW94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NDc3NDIsImV4cCI6MjEwNDQyMzc0Mn0.lYNBpav3HKenOLF3Aah6i8nkxARgUU35Z2wk9xRGNVA';

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
        }

        console.error('Supabase storage upload error:', uploadError.message);

        // On Vercel / Serverless production, local disk is read-only, so return the actual error immediately
        if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
          return NextResponse.json({ error: `Storage upload failed: ${uploadError.message}` }, { status: 500 });
        }
      } catch (storageErr) {
        console.error('Supabase storage exception:', storageErr);
        if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
          return NextResponse.json({ error: `Storage exception: ${storageErr.message}` }, { status: 500 });
        }
      }
    }

    // 2. Fallback to local disk (useful for local offline development only)
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
    return NextResponse.json({ error: err.message || 'Failed to upload image.' }, { status: 500 });
  }
}
