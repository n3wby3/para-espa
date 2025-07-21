import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FolderKanban, 
  Target, 
  BookOpen, 
  Archive, 
  Plus, 
  TrendingUp,
  Clock,
  CheckCircle,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";

// Datos de ejemplo para el dashboard
const dashboardData = {
  proyectos: {
    total: 8,
    activos: 5,
    completados: 3,
    proximos: 2
  },
  areas: {
    total: 6,
    revision: 2,
    saludables: 4
  },
  recursos: {
    total: 156,
    nuevos: 12,
    favoritos: 23
  },
  archivo: {
    total: 89,
    recientes: 5
  }
};

const proyectosRecientes = [
  {
    id: 1,
    titulo: "Rediseño de la aplicación móvil",
    estado: "En progreso",
    prioridad: "Alta",
    vencimiento: "2024-02-15"
  },
  {
    id: 2,
    titulo: "Implementar autenticación OAuth",
    estado: "En progreso", 
    prioridad: "Media",
    vencimiento: "2024-02-20"
  },
  {
    id: 3,
    titulo: "Documentación técnica API",
    estado: "Pausado",
    prioridad: "Baja",
    vencimiento: "2024-03-01"
  }
];

const areasActivas = [
  {
    id: 1,
    nombre: "Desarrollo Personal",
    descripcion: "Crecimiento profesional y habilidades",
    ultimaRevision: "Hace 3 días",
    estado: "saludable"
  },
  {
    id: 2,
    nombre: "Gestión de Equipo",
    descripcion: "Liderazgo y coordinación",
    ultimaRevision: "Hace 1 semana", 
    estado: "revision"
  },
  {
    id: 3,
    nombre: "Finanzas Personales",
    descripcion: "Presupuesto y inversiones",
    ultimaRevision: "Hace 2 días",
    estado: "saludable"
  }
];

export function ParaOverview() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Bienvenido a PARA
          </h1>
          <p className="text-lg text-muted-foreground">
            Tu sistema personal de organización del conocimiento
          </p>
        </div>
        <Button variant="para" size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Crear Nuevo
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="para-projects">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proyectos</CardTitle>
            <FolderKanban className="h-4 w-4 text-para-projects" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.proyectos.activos}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.proyectos.total} total, {dashboardData.proyectos.proximos} próximos a vencer
            </p>
            <Link to="/proyectos">
              <Button variant="projects" size="sm" className="mt-3 w-full">
                Ver Proyectos
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="para-areas">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Áreas</CardTitle>
            <Target className="h-4 w-4 text-para-areas" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.areas.total}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.areas.revision} necesitan revisión
            </p>
            <Link to="/areas">
              <Button variant="areas" size="sm" className="mt-3 w-full">
                Ver Áreas
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="para-resources">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recursos</CardTitle>
            <BookOpen className="h-4 w-4 text-para-resources" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.recursos.total}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.recursos.nuevos} añadidos esta semana
            </p>
            <Link to="/recursos">
              <Button variant="resources" size="sm" className="mt-3 w-full">
                Ver Recursos
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="para-archive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archivo</CardTitle>
            <Archive className="h-4 w-4 text-para-archive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.archivo.total}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.archivo.recientes} archivados recientemente
            </p>
            <Link to="/archivo">
              <Button variant="archive" size="sm" className="mt-3 w-full">
                Ver Archivo
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-para-projects" />
              Proyectos Recientes
            </CardTitle>
            <CardDescription>
              Tus proyectos más activos y próximos vencimientos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {proyectosRecientes.map((proyecto) => (
              <div key={proyecto.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{proyecto.titulo}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={proyecto.estado === "En progreso" ? "default" : "secondary"} className="text-xs">
                      {proyecto.estado}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {proyecto.prioridad}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Vence</p>
                  <p className="text-sm font-medium">{new Date(proyecto.vencimiento).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</p>
                </div>
              </div>
            ))}
            <Link to="/proyectos">
              <Button variant="outline" size="sm" className="w-full mt-2">
                Ver Todos los Proyectos
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Active Areas */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-para-areas" />
              Áreas de Responsabilidad
            </CardTitle>
            <CardDescription>
              Estado actual de tus áreas principales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {areasActivas.map((area) => (
              <div key={area.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{area.nombre}</h4>
                  <p className="text-xs text-muted-foreground">{area.descripcion}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Última revisión: {area.ultimaRevision}
                  </p>
                </div>
                <div className="flex items-center">
                  {area.estado === "saludable" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              </div>
            ))}
            <Link to="/areas">
              <Button variant="outline" size="sm" className="w-full mt-2">
                Ver Todas las Áreas
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Acciones Rápidas
          </CardTitle>
          <CardDescription>
            Tareas comunes para mantener tu sistema PARA organizado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="projects" className="justify-start gap-2 h-auto p-4">
              <Plus className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Nuevo Proyecto</div>
                <div className="text-xs opacity-80">Crear proyecto con fecha límite</div>
              </div>
            </Button>
            
            <Button variant="areas" className="justify-start gap-2 h-auto p-4">
              <Target className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Definir Área</div>
                <div className="text-xs opacity-80">Nueva responsabilidad continua</div>
              </div>
            </Button>
            
            <Button variant="resources" className="justify-start gap-2 h-auto p-4">
              <BookOpen className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Añadir Recurso</div>
                <div className="text-xs opacity-80">Guardar referencia útil</div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start gap-2 h-auto p-4">
              <BarChart3 className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Ver Analíticas</div>
                <div className="text-xs opacity-80">Métricas de productividad</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}