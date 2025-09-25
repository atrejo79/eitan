import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario con su rol
    const usuario = await prisma.usuarios.findFirst({
      where: {
        email: email,
        estado: 'activo'
      },
      include: {
        roles: true
      }
    });

    if (!usuario) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 401 }
      );
    }

    // Verificar contraseña - TEMPORAL para pruebas
    // En producción usar: const valid = await bcrypt.compare(password, usuario.contrasena);
    const valid = password === usuario.contrasena;

    if (!valid) {
      return NextResponse.json(
        { success: false, message: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    // ⚡ AQUÍ DEFINES LA REDIRECCIÓN SEGÚN EL ROL
    let redirectPath = '/';
    const roleName = usuario.roles.nombre.toLowerCase();
    
    if (roleName === 'recepcion') {
      redirectPath = '/mesa_entrada';  // 👈 Cambiar aquí para recepción
    } else if (roleName === 'profesional') {
      redirectPath = '/turnos';    // 👈 Cambiar aquí para profesional
    } else {
      redirectPath = '/dashboard';      // 👈 Ruta por defecto
    }

    return NextResponse.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: usuario.usuario_id,
        nombre: `${usuario.nombre} ${usuario.apellido}`,
        email: usuario.email,
        rol: usuario.roles.nombre
      },
      redirectPath  // 👈 Aquí se envía la ruta de redirección
    });

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { success: false, message: 'Error del servidor' },
      { status: 500 }
    );
  }
}