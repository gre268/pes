import { NextResponse } from 'next/server';

// Función para manejar el método GET y devolver el ID del usuario autenticado
export async function GET() {
  try {
    // Simulación de un usuario autenticado (puedes conectarlo a un sistema real de autenticación)
    const user = {
      userID: 1, // Simulamos que el usuario actual tiene el ID 1
      name: "Greivin Carrillo Jiménez", // Nombre del usuario
    };

    // Enviamos una respuesta con éxito, incluyendo el ID del usuario
    return NextResponse.json({ success: true, userID: user.userID, name: user.name });
  } catch (err: any) {
    console.error('Error al obtener el usuario:', err.message);
    return NextResponse.json({ success: false, message: 'Error al obtener el usuario' }, { status: 500 });
  }
}
