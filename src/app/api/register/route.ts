import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, category, institution } = body;

    if (!fullName || !email || !institution) {
      return NextResponse.json(
        { error: 'Missing required fields: fullName, email, institution' },
        { status: 400 }
      );
    }

    const randomStation = Math.floor(Math.random() * 50) + 1;
    const passId = `SSIET-VLSI-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const pass = {
      passId,
      fullName,
      email,
      phone,
      category: category || 'student',
      institution,
      workstationNumber: `CAD-STATION #${randomStation < 10 ? '0' + randomStation : randomStation}`,
      fee: 2500,
      paymentStatus: 'CONFIRMED',
      issuedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, pass }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process registration' },
      { status: 500 }
    );
  }
}
