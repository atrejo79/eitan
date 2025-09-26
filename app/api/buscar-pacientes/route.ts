import { NextResponse } from "next/server";
import { PrismaClient, pacientes as PacienteModel } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const documento = searchParams.get("documento");
    const apellido = searchParams.get("apellido");

    if (!documento && !apellido) {
      return NextResponse.json(
        { error: "Debe proporcionar documento o apellido" },
        { status: 400 }
      );
    }

    let pacientes: PacienteModel[] = [];

    if (documento) {
      pacientes = await prisma.pacientes.findMany({
        where: { documento: documento },
      });
    } else if (apellido) {
      pacientes = await prisma.pacientes.findMany({
        where: { apellido: { contains: apellido } },
      });
    }

    return NextResponse.json(pacientes);
  } catch (error) {
    console.error("❌ Error en GET /buscar-pacientes:", error);
    return NextResponse.json({ error: "Error en la búsqueda" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("📥 Datos recibidos para crear paciente:", data);

    // Validaciones de campos obligatorios
    if (!data.nombre || !data.apellido || !data.documento) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: nombre, apellido o documento" },
        { status: 400 }
      );
    }

    // Validar fecha_nacimiento si viene
    let fechaNacimiento: Date | null = null;
    if (data.fecha_nacimiento) {
      const fechaStr = data.fecha_nacimiento.replace(/\//g, "-"); // de AAAA/MM/DD a AAAA-MM-DD
      const fecha = new Date(fechaStr);
      if (isNaN(fecha.getTime())) {
        return NextResponse.json(
          { error: "Fecha de nacimiento inválida" },
          { status: 400 }
        );
      }
      fechaNacimiento = fecha;
    }

    // Si tu modelo tiene obra_social_id en vez de obra_social:
    let obraSocialId: number | null = null;
    if (data.obra_social_id !== undefined) {
      const num = Number(data.obra_social_id);
      if (isNaN(num)) {
        return NextResponse.json(
          { error: "obra_social_id debe ser un número" },
          { status: 400 }
        );
      }
      obraSocialId = num;
    }

    const nuevoPaciente = await prisma.pacientes.create({
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        documento: data.documento,
        email: data.email ?? null,
        telefono: data.telefono ?? null,
        fecha_nacimiento: fechaNacimiento,
        obra_social_id: obraSocialId, // <--- aquí usamos el nombre correcto
      },
    });

    return NextResponse.json(nuevoPaciente, { status: 201 });
  } catch (error) {
    console.error("❌ Error en POST /buscar-pacientes:", error);
    return NextResponse.json(
      { error: "Error al crear paciente" },
      { status: 500 }
    );
  }
}
