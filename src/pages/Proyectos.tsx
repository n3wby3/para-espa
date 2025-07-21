import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  Flag,
  CheckCircle,
  Pause,
  Play,
  MoreHorizontal,
  Filter
} from "lucide-react";

// Datos de ejemplo
const proyectosIniciales = [
  {
    id: 1,
    titulo: "Rediseño de la aplicación móvil",
    descripcion: "Mejorar la experiencia de usuario y modernizar el diseño de la app móvil",
    estado: "En progreso",
    prioridad: "Alta",
    fechaCreacion: "2024-01-15",
    fechaVencimiento: "2024-02-15",
    progreso: 65,
    etiquetas: ["UI/UX", "Móvil", "Frontend"],
    responsable: "Equipo de Diseño"
  },
  {
    id: 2,
    titulo: "Implementar autenticación OAuth",
    descripcion: "Integrar sistema de login con Google, GitHub y Microsoft",
    estado: "En progreso",
    prioridad: "Media",
    fechaCreacion: "2024-01-20",
    fechaVencimiento: "2024-02-20",
    progreso: 30,
    etiquetas: ["Backend", "Seguridad", "API"],
    responsable: "Equipo Backend"
  },
  {
    id: 3,
    titulo: "Documentación técnica API",
    descripcion: "Crear documentación completa de la API REST para desarrolladores",
    estado: "Pausado",
    prioridad: "Baja",
    fechaCreacion: "2024-01-10",
    fechaVencimiento: "2024-03-01",
    progreso: 15,
    etiquetas: ["Documentación", "API", "DevEx"],
    responsable: "Equipo Técnico"
  },
  {
    id: 4,
    titulo: "Optimización de base de datos",
    descripcion: "Mejorar rendimiento de consultas y estructurar índices",
    estado: "Completado",
    prioridad: "Alta",
    fechaCreacion: "2024-01-05",
    fechaVencimiento: "2024-01-25",
    progreso: 100,
    etiquetas: ["Base de datos", "Performance", "Backend"],
    responsable: "DBA Team"
  },
  {
    id: 5,
    titulo: "Sistema de notificaciones push",
    descripcion: "Implementar notificaciones en tiempo real para usuarios",
    estado: "En progreso",
    prioridad: "Media",
    fechaCreacion: "2024-01-22",
    fechaVencimiento: "2024-02-28",
    progreso: 45,
    etiquetas: ["Notificaciones", "Real-time", "Usuario"],
    responsable: "Equipo Fullstack"
  }
];

const estadosDisponibles = ["Todos", "En progreso", "Pausado", "Completado"];
const prioridadesDisponibles = ["Todas", "Alta", "Media", "Baja"];

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CrearProyectoForm } from "@/components/dashboard/CrearProyectoForm";

export default function Proyectos() {
  const [proyectos, setProyectos] = useState(proyectosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroPrioridad, setFiltroPrioridad] = useState("Todas");
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const handleProjectCreate = (newProject: any) => {
    setProyectos([newProject, ...proyectos]);
  };

  const proyectosFiltrados = proyectos.filter(proyecto => {
    const coincideBusqueda = proyecto.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                            proyecto.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
                            proyecto.etiquetas.some(etiqueta => etiqueta.toLowerCase().includes(busqueda.toLowerCase()));
    
    const coincideEstado = filtroEstado === "Todos" || proyecto.estado === filtroEstado;
    const coincidePrioridad = filtroPrioridad === "Todas" || proyecto.prioridad === filtroPrioridad;
    
    return coincideBusqueda && coincideEstado && coincidePrioridad;
  });

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "En progreso":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Pausado":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Completado":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "Alta":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Media":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "Baja":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "En progreso":
        return <Play className="h-4 w-4" />;
      case "Pausado":
        return <Pause className="h-4 w-4" />;
      case "Completado":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const diasRestantes = (fechaVencimiento: string) => {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diferencia = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 3600 * 24));
    return diferencia;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-para-projects">Proyectos</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tus proyectos activos con fechas límite específicas
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setCreateModalOpen}>
          <DialogTrigger asChild>
            <Button variant="projects" size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Nuevo Proyecto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
            </DialogHeader>
            <CrearProyectoForm
              onProjectCreate={handleProjectCreate}
              onClose={() => setCreateModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
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
                  placeholder="Buscar proyectos por título, descripción o etiquetas..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                {estadosDisponibles.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
              
              <select
                value={filtroPrioridad}
                onChange={(e) => setFiltroPrioridad(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                {prioridadesDisponibles.map(prioridad => (
                  <option key={prioridad} value={prioridad}>{prioridad}</option>
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
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold">{proyectos.length}</p>
              </div>
              <Flag className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">En Progreso</p>
                <p className="text-2xl font-bold text-blue-600">
                  {proyectos.filter(p => p.estado === "En progreso").length}
                </p>
              </div>
              <Play className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Completados</p>
                <p className="text-2xl font-bold text-green-600">
                  {proyectos.filter(p => p.estado === "Completado").length}
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
                <p className="text-sm font-medium">Próximos a Vencer</p>
                <p className="text-2xl font-bold text-red-600">
                  {proyectos.filter(p => diasRestantes(p.fechaVencimiento) <= 7 && p.estado !== "Completado").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {proyectosFiltrados.map((proyecto, index) => {
          const dias = diasRestantes(proyecto.fechaVencimiento);
          const urgente = dias <= 7 && proyecto.estado !== "Completado";
          
          return (
            <Card 
              key={proyecto.id} 
              className={`para-card animate-scale-in hover:shadow-xl transition-all duration-300 ${urgente ? 'ring-2 ring-red-500/20' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{proyecto.titulo}</CardTitle>
                    <CardDescription className="mt-2">
                      {proyecto.descripcion}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Status and Priority */}
                <div className="flex items-center gap-2">
                  <Badge className={getEstadoColor(proyecto.estado)}>
                    {getEstadoIcon(proyecto.estado)}
                    <span className="ml-1">{proyecto.estado}</span>
                  </Badge>
                  <Badge className={getPrioridadColor(proyecto.prioridad)}>
                    <Flag className="h-3 w-3 mr-1" />
                    {proyecto.prioridad}
                  </Badge>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso</span>
                    <span className="font-medium">{proyecto.progreso}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-para-projects h-2 rounded-full transition-all duration-300"
                      style={{ width: `${proyecto.progreso}%` }}
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Creado</p>
                    <p className="font-medium">{formatearFecha(proyecto.fechaCreacion)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Vencimiento</p>
                    <p className={`font-medium ${urgente ? 'text-red-600' : ''}`}>
                      {formatearFecha(proyecto.fechaVencimiento)}
                      {dias >= 0 && proyecto.estado !== "Completado" && (
                        <span className={`text-xs ml-1 ${urgente ? 'text-red-600' : 'text-muted-foreground'}`}>
                          ({dias} días)
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {proyecto.etiquetas.map((etiqueta) => (
                    <Badge key={etiqueta} variant="outline" className="text-xs">
                      {etiqueta}
                    </Badge>
                  ))}
                </div>

                {/* Responsible */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{proyecto.responsable}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Ver Detalles
                  </Button>
                  <Button variant="projects" size="sm" className="flex-1">
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {proyectosFiltrados.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Flag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No se encontraron proyectos</h3>
            <p className="text-muted-foreground mb-4">
              {busqueda || filtroEstado !== "Todos" || filtroPrioridad !== "Todas" 
                ? "Intenta ajustar los filtros de búsqueda" 
                : "Comienza creando tu primer proyecto"}
            </p>
            <Button variant="projects" className="gap-2">
              <Plus className="h-4 w-4" />
              Crear Primer Proyecto
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}