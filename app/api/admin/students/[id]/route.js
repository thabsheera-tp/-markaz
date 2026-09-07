import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth, checkRole, logActivity, getClientIp } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const roleErr = checkRole(auth.user, ['admin', 'editor']);
    if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

    const { id } = await params;
    const body = await req.json();
    const { name, email, phone, institution_id, enrollment_date, fee_status } = body;

    await query.run(
      `UPDATE students SET name = ?, email = ?, phone = ?, institution_id = ?, enrollment_date = ?, fee_status = ?
       WHERE id = ?`,
      [name.trim(), email, phone, institution_id, enrollment_date, fee_status, id]
    );

    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'Updated Student', `Updated details for student ID ${id}`, ip);

    return NextResponse.json({ message: 'Student updated successfully.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update student.' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const roleErr = checkRole(auth.user, ['admin']);
    if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

    const { id } = await params;
    const student = await query.get('SELECT * FROM students WHERE id = ?', [id]);
    if (student && student.institution_id) {
      await query.run('UPDATE institutions SET enrollment_count = MAX(0, enrollment_count - 1) WHERE id = ?', [student.institution_id]);
    }

    await query.run('DELETE FROM students WHERE id = ?', [id]);

    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'Deleted Student', `Removed student ID ${id}`, ip);

    return NextResponse.json({ message: 'Student deleted successfully.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete student.' }, { status: 500 });
  }
}
