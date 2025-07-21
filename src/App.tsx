import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import Index from "./pages/Index";
import Proyectos from "./pages/Proyectos";
import Areas from "./pages/Areas";
import Recursos from "./pages/Recursos";
import Archivo from "./pages/Archivo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const areasIniciales = [
  {
    id: 1,
    nombre: "Desarrollo Personal",
    descripcion: "Crecimiento profesional, habilidades técnicas y formación continua",
    categoria: "Profesional",
    estado: "saludable",
    ultimaRevision: "2024-01-20",
    proximaRevision: "2024-02-20",
    kpis: [
      { nombre: "Horas de estudio", valor: 25, objetivo: 30, unidad: "horas/mes" },
      { nombre: "Cursos completados", valor: 2, objetivo: 3, unidad: "cursos/trimestre" }
    ],
    notas: "Progreso constante en tecnologías frontend. Enfocar en TypeScript avanzado.",
    responsabilidades: [
      "Mantenerse actualizado con tecnologías",
      "Completar certificaciones",
      "Participar en comunidades tech",
      "Mentorear desarrolladores junior"
    ]
  },
  {
    id: 2,
    nombre: "Gestión de Equipo",
    descripcion: "Liderazgo, coordinación y desarrollo del equipo de trabajo",
    categoria: "Liderazgo",
    estado: "revision",
    ultimaRevision: "2024-01-10",
    proximaRevision: "2024-02-10",
    kpis: [
      { nombre: "Satisfacción del equipo", valor: 7.5, objetivo: 8.5, unidad: "/10" },
      { nombre: "Velocidad de entrega", valor: 85, objetivo: 90, unidad: "%" }
    ],
    notas: "Necesita más comunicación proactiva. Implementar reuniones 1:1 semanales.",
    responsabilidades: [
      "Realizar reuniones de seguimiento",
      "Gestionar carga de trabajo",
      "Facilitar resolución de conflictos",
      "Planificar desarrollo profesional del equipo"
    ]
  },
  {
    id: 3,
    nombre: "Finanzas Personales",
    descripcion: "Gestión de presupuesto, inversiones y planificación financiera",
    categoria: "Personal",
    estado: "saludable",
    ultimaRevision: "2024-01-18",
    proximaRevision: "2024-02-18",
    kpis: [
      { nombre: "Ahorro mensual", valor: 1200, objetivo: 1500, unidad: "€" },
      { nombre: "ROI inversiones", valor: 8.2, objetivo: 7.0, unidad: "%" }
    ],
    notas: "Buen progreso en objetivos de ahorro. Considerar diversificar cartera.",
    responsabilidades: [
      "Revisar gastos mensuales",
      "Actualizar presupuesto",
      "Analizar rendimiento inversiones",
      "Planificar objetivos a largo plazo"
    ]
  },
  {
    id: 4,
    nombre: "Salud y Bienestar",
    descripcion: "Ejercicio físico, alimentación saludable y bienestar mental",
    categoria: "Personal",
    estado: "atencion",
    ultimaRevision: "2024-01-15",
    proximaRevision: "2024-02-15",
    kpis: [
      { nombre: "Ejercicio semanal", valor: 2, objetivo: 4, unidad: "días/semana" },
      { nombre: "Horas de sueño", valor: 6.5, objetivo: 8, unidad: "horas/día" }
    ],
    notas: "Necesita más consistencia en rutina de ejercicio. Mejorar higiene del sueño.",
    responsabilidades: [
      "Mantener rutina de ejercicio",
      "Planificar comidas saludables",
      "Gestionar estrés",
      "Realizar chequeos médicos regulares"
    ]
  },
  {
    id: 5,
    nombre: "Relaciones Familiares",
    descripcion: "Tiempo de calidad con familia y mantenimiento de vínculos",
    categoria: "Personal",
    estado: "saludable",
    ultimaRevision: "2024-01-22",
    proximaRevision: "2024-02-22",
    kpis: [
      { nombre: "Tiempo familiar", valor: 15, objetivo: 20, unidad: "horas/semana" },
      { nombre: "Actividades conjuntas", valor: 3, objetivo: 3, unidad: "actividades/mes" }
    ],
    notas: "Buena comunicación y tiempo de calidad. Mantener tradiciones familiares.",
    responsabilidades: [
      "Planificar actividades familiares",
      "Mantener comunicación regular",
      "Celebrar ocasiones especiales",
      "Apoyar objetivos individuales de cada miembro"
    ]
  },
  {
    id: 6,
    nombre: "Infraestructura Tecnológica",
    descripcion: "Mantenimiento de sistemas, herramientas y procesos técnicos",
    categoria: "Profesional",
    estado: "revision",
    ultimaRevision: "2024-01-12",
    proximaRevision: "2024-02-12",
    kpis: [
      { nombre: "Uptime sistemas", valor: 99.2, objetivo: 99.5, unidad: "%" },
      { nombre: "Vulnerabilidades resueltas", valor: 8, objetivo: 10, unidad: "por mes" }
    ],
    notas: "Actualizar documentación de procesos. Revisar políticas de backup.",
    responsabilidades: [
      "Monitorear sistemas en producción",
      "Actualizar dependencias regularmente",
      "Mantener documentación técnica",
      "Implementar mejoras de seguridad"
    ]
  }
];

const App = () => {
  const [areas, setAreas] = useState(areasIniciales);

  const handleAreaCreate = (newAreaName: string) => {
    const newArea = {
      id: Date.now(),
      nombre: newAreaName,
      descripcion: "Nueva área, por favor actualiza la descripción.",
      categoria: "Personal",
      estado: "revision",
      ultimaRevision: new Date().toISOString().split("T")[0],
      proximaRevision: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      kpis: [],
      notas: "",
      responsabilidades: []
    };
    setAreas([...areas, newArea]);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen w-full bg-background">
            <Sidebar />
            <main className="flex-1 p-6 overflow-auto">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/proyectos" element={<Proyectos areas={areas} onAreaCreate={handleAreaCreate} />} />
                <Route path="/areas" element={<Areas areas={areas} />} />
                <Route path="/recursos" element={<Recursos />} />
                <Route path="/archivo" element={<Archivo />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;