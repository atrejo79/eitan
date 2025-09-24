// /app/api/turnos/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const turnos = await prisma.turnos.findMany({
    include: {
      pacientes: true,
      profesionales: true,
    },
  });
  return NextResponse.json(turnos);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { paciente_id, profesional_id, fecha, hora } = body;

    // Combinar fecha y hora
    const inicio = new Date(`${fecha}T${hora}:00`);

    // Cada turno dura 30 minutos → 'fin' = inicio + 30 minutos
    const fin = new Date(inicio);
    fin.setMinutes(fin.getMinutes() + 30);

    const nuevoTurno = await prisma.turnos.create({
      data: {
        paciente_id: Number(paciente_id),
        profesional_id: Number(profesional_id),
        inicio,
        fin,
      },
    });

    return NextResponse.json(nuevoTurno, { status: 201 });
  } catch (error: any) {
    console.error("Error creando turno:", error);
    return NextResponse.json(
      { error: "Error al crear el turno" },
      { status: 500 }
    );
  }
}
