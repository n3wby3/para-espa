import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  MoreHorizontal,
  Target
} from "lucide-react";

// Datos de ejemplo para áreas
const areas = [
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

const categorias = ["Todas", "Profesional", "Personal", "Liderazgo"];
const estados = ["Todos", "saludable", "revision", "atencion"];

export default function Areas() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  const areasFiltradas = areas.filter(area => {
    const coincideBusqueda = area.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                            area.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
                            area.categoria.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideCategoria = filtroCategoria === "Todas" || area.categoria === filtroCategoria;
    const coincideEstado = filtroEstado === "Todos" || area.estado === filtroEstado;
    
    return coincideBusqueda && coincideCategoria && coincideEstado;
  });

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "saludable":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "revision":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "atencion":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "saludable":
        return <CheckCircle className="h-4 w-4" />;
      case "revision":
        return <Clock className="h-4 w-4" />;
      case "atencion":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const calcularProgresoKPI = (kpi: any) => {
    return Math.min((kpi.valor / kpi.objetivo) * 100, 100);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const diasHastaRevision = (fechaRevision: string) => {
    const hoy = new Date();
    const revision = new Date(fechaRevision);
    const diferencia = Math.ceil((revision.getTime() - hoy.getTime()) / (1000 * 3600 * 24));
    return diferencia;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-para-areas">Áreas de Responsabilidad</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tus responsabilidades continuas y estándares a mantener
          </p>
        </div>
        <Button variant="areas" size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Nueva Área
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar áreas por nombre, descripción o categoría..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
              
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                {estados.map(estado => (
                  <option key={estado} value={estado}>
                    {estado === "Todos" ? estado : estado.charAt(0).toUpperCase() + estado.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Áreas</p>
                <p className="text-2xl font-bold">{areas.length}</p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Saludables</p>
                <p className="text-2xl font-bold text-green-600">
                  {areas.filter(a => a.estado === "saludable").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Necesitan Revisión</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {areas.filter(a => a.estado === "revision").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Requieren Atención</p>
                <p className="text-2xl font-bold text-red-600">
                  {areas.filter(a => a.estado === "atencion").length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Areas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {areasFiltradas.map((area, index) => {
          const dias = diasHastaRevision(area.proximaRevision);
          const necesitaRevision = dias <= 7;
          
          return (
            <Card 
              key={area.id} 
              className={`para-card animate-scale-in hover:shadow-xl transition-all duration-300 ${necesitaRevision ? 'ring-2 ring-yellow-500/20' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{area.nombre}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {area.categoria}
                      </Badge>
                    </div>
                    <CardDescription>
                      {area.descripcion}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Status */}
                <div className="flex items-center gap-2">
                  <Badge className={getEstadoColor(area.estado)}>
                    {getEstadoIcon(area.estado)}
                    <span className="ml-1 capitalize">{area.estado}</span>
                  </Badge>
                  {necesitaRevision && (
                    <Badge variant="outline" className="text-yellow-600">
                      <Clock className="h-3 w-3 mr-1" />
                      Revisión pendiente
                    </Badge>
                  )}
                </div>

                {/* KPIs */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Indicadores Clave</h4>
                  {area.kpis.map((kpi, kpiIndex) => {
                    const progreso = calcularProgresoKPI(kpi);
                    const cumpleObjetivo = kpi.valor >= kpi.objetivo;
                    
                    return (
                      <div key={kpiIndex} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{kpi.nombre}</span>
                          <span className={`font-medium ${cumpleObjetivo ? 'text-green-600' : 'text-orange-600'}`}>
                            {kpi.valor} / {kpi.objetivo} {kpi.unidad}
                          </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              cumpleObjetivo ? 'bg-green-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${progreso}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Última revisión</p>
                    <p className="font-medium">{formatearFecha(area.ultimaRevision)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Próxima revisión</p>
                    <p className={`font-medium ${necesitaRevision ? 'text-yellow-600' : ''}`}>
                      {formatearFecha(area.proximaRevision)}
                      {dias >= 0 && (
                        <span className={`text-xs ml-1 ${necesitaRevision ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                          ({dias} días)
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground mb-1">Notas</p>
                  <p className="text-sm">{area.notas}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Ver Detalles
                  </Button>
                  <Button variant="areas" size="sm" className="flex-1">
                    Revisar Área
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {areasFiltradas.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No se encontraron áreas</h3>
            <p className="text-muted-foreground mb-4">
              {busqueda || filtroCategoria !== "Todas" || filtroEstado !== "Todos" 
                ? "Intenta ajustar los filtros de búsqueda" 
                : "Comienza definiendo tu primera área de responsabilidad"}
            </p>
            <Button variant="areas" className="gap-2">
              <Plus className="h-4 w-4" />
              Crear Primera Área
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}