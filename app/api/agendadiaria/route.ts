import { NextResponse } from "next/server";
import { prisma, Prisma } from "@/lib/prisma"; // o `import { Prisma } from '@prisma/client'`

// Tipo con relaciones que incluye tu consulta
type TurnoWithRels = Prisma.turnosGetPayload<{
  include: {
    pacientes: true;
    profesionales: { include: { usuarios: true; profesiones: true } };
    obras_sociales: true;
  };
}>;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const profesionalId = searchParams.get("profesional_id");
    const fecha = searchParams.get("fecha");
    const horario = searchParams.get("horario");
    const estado = searchParams.get("estado");

    if (!profesionalId) {
      return NextResponse.json(
        { error: "Debe especificar un profesional_id" },
        { status: 400 }
      );
    }

    const where: any = { profesional_id: Number(profesionalId) };

    if (fecha) {
      const inicioDia = new Date(`${fecha}T00:00:00-03:00`);
      const finDia    = new Date(`${fecha}T23:59:59.999-03:00`);
      let gte = inicioDia, lte = finDia;

      if (horario === "maniana") {
        gte = new Date(`${fecha}T08:00:00-03:00`);
        lte = new Date(`${fecha}T11:59:59.999-03:00`);
      } else if (horario === "tarde") {
        gte = new Date(`${fecha}T12:00:00-03:00`);
        lte = new Date(`${fecha}T18:00:00.000-03:00`);
      }
      where.inicio = { gte, lte };
    }

    if (estado === "ocupados") where.paciente_id = { not: null };
    else if (estado === "libres") where.paciente_id = null;

    // Tipá el resultado para que el map infiera `t`
    const turnos: TurnoWithRels[] = await prisma.turnos.findMany({
      where,
      include: {
        pacientes: true,
        profesionales: { include: { usuarios: true, profesiones: true } },
        obras_sociales: true,
      },
      orderBy: { inicio: "asc" },
    });

    // Ahora `t` NO es any
    const serialized = turnos.map((t) => ({
      ...t,
      turno_id: t.turno_id.toString(),
      inicio: t.inicio instanceof Date ? t.inicio.toISOString() : t.inicio,
      fin: t.fin instanceof Date ? t.fin.toISOString() : t.fin,
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("Error obteniendo turnos:", error);
    return NextResponse.json({ error: "Error interno en el servidor" }, { status: 500 });
  }
}
