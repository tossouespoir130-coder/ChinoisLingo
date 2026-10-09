import { NextResponse } from 'next/server';
import { getClientExercisesCatalog } from '@/lib/server/exercisesCorrection';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const catalog = getClientExercisesCatalog();
    return NextResponse.json({ catalog });
  } catch (error) {
    console.error('Erreur API /api/exercices/catalogue :', error);
    return NextResponse.json({ erreur: 'Erreur interne lors du chargement du catalogue.' }, { status: 500 });
  }
}
