// Archivo para definir los api endpoints de pacientes

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const turnos = await prisma.turnos.findMany();
  return NextResponse.json(turnos);
}