import Link from 'next/link';

const benefits = [
  {
    title: 'Listo en minutos',
    description: 'De idea a spec técnica completa sin horas de documentación.',
  },
  {
    title: 'Estructura lista para devs',
    description: 'Genera features, stack, criterios de aceptación y rutas de API.',
  },
  {
    title: 'Historial local',
    description: 'Todas tus specs guardadas en el navegador, sin base de datos.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-4">
          AI Spec Builder
        </h1>
        <p className="text-xl text-gray-500 mb-12">
          Convierte cualquier idea de producto en una especificación técnica completa en minutos.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 mb-12">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-left"
            >
              <h3 className="font-semibold text-gray-900 mb-1">{b.title}</h3>
              <p className="text-sm text-gray-500">{b.description}</p>
            </div>
          ))}
        </div>

        <Link
          href="/sign-in"
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
        >
          Empezar
        </Link>
      </div>
    </div>
  );
}
