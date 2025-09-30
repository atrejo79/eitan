// Archivo para definir los api endpoints de pacientes

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const pacientes = await prisma.pacientes.findMany({
    include: {
      obras_sociales: { select: { nombre: true } }, // 👈 incluir nombre de obra social
    },
  });
  return NextResponse.json(pacientes);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      nombre,
      apellido,
      documento,
      email,
      telefono,
      fecha_nacimiento,
      obra_social_id,
      genero,
    } = body;

    if (!nombre || !apellido || !documento || !email || !telefono) {
      return NextResponse.json({ error: 'Faltan campos' }, { status: 400 });
    }

    const paciente = await prisma.pacientes.create({
      data: {
        nombre,
        apellido,
        documento,
        email,
        telefono,
        genero: genero ?? null,
        fecha_nacimiento: toUTCDate(fecha_nacimiento),
        fecha_registro: new Date(),
        obra_social_id: obra_social_id ?? null,
      },
      include: {
        obras_sociales: { select: { nombre: true } }, // 👈 devolver también el nombre al crear
      },
    });

    return NextResponse.json({ ok: true, paciente });
  } catch (e: any) {
    if (e?.code === 'P2002') {
      return NextResponse.json({ error: 'Documento o email ya existen.' }, { status: 409 });
    }
    if (e?.name === 'PrismaClientValidationError') {
      console.error('Error al crear paciente:', e);
      return NextResponse.json(
        { error: 'Datos inválidos.', detalle: e.message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: e?.message ?? 'Error inesperado' }, { status: 500 });
  }

  function toUTCDate(isoYYYYMMDD?: string | null) {
    if (!isoYYYYMMDD) return null;
    const [y, m, d] = isoYYYYMMDD.split('-').map(Number);
    if (!y || !m || !d) return null;
    return new Date(Date.UTC(y, m - 1, d)); // medianoche UTC
  }
}
