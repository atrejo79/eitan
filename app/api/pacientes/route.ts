// Archivo para definir los api endpoints de pacientes

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const pacientes = await prisma.pacientes.findMany();
  return NextResponse.json(pacientes);
}

export async function POST(req: Request) {
  try {
    const { nombre, apellido, dni, email, telefono } = await req.json();
    if (!nombre || !apellido || !dni || !email || !telefono) {
      return NextResponse.json({ error: 'Faltan campos' }, { status: 400 });
    }
    const paciente = await prisma.pacientes.create({
      data: {
        nombre,
        apellido,
        dni,
        email, 
        telefono
      },
    });
    return NextResponse.json({ ok: true, paciente });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Error inesperado' }, { status: 500 });
  }
}