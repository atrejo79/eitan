// Archivo para definir los api endpoints de pacientes

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const profesionales = await prisma.profesionales.findMany({
    include: {
      usuarios: true,
      profesiones: true,
    }
  });
  return NextResponse.json(profesionales);
}