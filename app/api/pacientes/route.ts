// Archivo para definir los api endpoints de pacientes

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const pacientes = await prisma.pacientes.findMany();
  return NextResponse.json(pacientes);
}