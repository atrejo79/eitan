import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/agendadiaria
 * 
 * Parámetros (query params):
 * - profesional_id: ID del profesional (obligatorio)
 * - fecha: Fecha en formato YYYY-MM-DD (opcional)
 * 
 * Funcionalidad:
 * Devuelve los turnos asignados a un profesional en un día específico.
 * Si no se envía la fecha, devuelve todos los turnos del profesional.
 */
export async function GET(req: Request) {
  try {
    // Obtener parámetros de la URL
    const { searchParams } = new URL(req.url);
    const profesionalId = searchParams.get("profesional_id");
    const fecha = searchParams.get("fecha"); // YYYY-MM-DD

    // Validar profesional_id
    if (!profesionalId) {
      return NextResponse.json(
        { error: "Debe especificar un profesional_id" },
        { status: 400 }
      );
    }

    // Filtro base (por profesional)
    let where: any = { profesional_id: Number(profesionalId) };

    // Si se pasa fecha, se construye el rango de ese día [00:00 → 23:59]
    if (fecha) {
      const inicio = new Date(`${fecha}T00:00:00`);
      const fin = new Date(`${fecha}T23:59:59.999`);
      where.inicio = { gte: inicio, lte: fin };
    }

    // Consulta a la base de datos con Prisma
    const turnos = await prisma.turnos.findMany({
      where,
      include: {
        pacientes: true, // datos del paciente
        profesionales: { include: { usuarios: true } }, // datos del profesional y su usuario
        obras_sociales: true, // obra social asociada
      },
      orderBy: { inicio: "asc" }, // ordenar cronológicamente
    });

    // Convertir BigInt → String para evitar problemas con JSON
    const serialized = turnos.map((t) => ({
      ...t,
      turno_id: t.turno_id.toString(),
    }));

    // Respuesta exitosa
    return NextResponse.json(serialized);
  } catch (error) {
    console.error("Error obteniendo turnos:", error);
    return NextResponse.json(
      { error: "Error interno en el servidor" },
      { status: 500 }
    );
  }
}
