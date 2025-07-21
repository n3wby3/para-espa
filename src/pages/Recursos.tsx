import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  BookOpen, 
  ExternalLink,
  Star,
  Tag,
  Calendar,
  Eye,
  Download,
  Share,
  MoreHorizontal,
  FileText,
  Video,
  Link,
  Image as ImageIcon,
  Music
} from "lucide-react";

// Datos de ejemplo para recursos
const recursos = [
  {
    id: 1,
    titulo: "Guía Completa de React TypeScript",
    descripcion: "Documentación exhaustiva sobre patrones y mejores prácticas en React con TypeScript",
    tipo: "documentacion",
    categoria: "Desarrollo",
    url: "https://react-typescript-cheatsheet.netlify.app/",
    fechaCreacion: "2024-01-15",
    fechaAcceso: "2024-01-20",
    etiquetas: ["React", "TypeScript", "Frontend", "Patrones"],
    favorito: true,
    vistas: 12,
    notas: "Excelente recurso para consultar patrones avanzados. Muy útil para el proyecto actual.",
    autor: "React TypeScript Community",
    valoracion: 5
  },
  {
    id: 2,
    titulo: "Principios de Diseño de Sistema",
    descripcion: "Artículo sobre cómo crear y mantener sistemas de diseño escalables",
    tipo: "articulo",
    categoria: "Diseño",
    url: "https://www.designsystem.com/principles",
    fechaCreacion: "2024-01-10",
    fechaAcceso: "2024-01-18",
    etiquetas: ["Design System", "UI/UX", "Escalabilidad", "Componentes"],
    favorito: false,
    vistas: 5,
    notas: "Ideas interesantes sobre tokens de diseño y componentes reutilizables.",
    autor: "Design System Team",
    valoracion: 4
  },
  {
    id: 3,
    titulo: "Curso: Advanced Node.js Patterns",
    descripcion: "Video curso sobre patrones avanzados en Node.js para aplicaciones enterprise",
    tipo: "video",
    categoria: "Backend",
    url: "https://egghead.io/courses/nodejs-patterns",
    fechaCreacion: "2024-01-08",
    fechaAcceso: "2024-01-16",
    etiquetas: ["Node.js", "Patrones", "Backend", "Enterprise"],
    favorito: true,
    vistas: 8,
    notas: "Muy buenas técnicas para gestión de errores y arquitectura modular. Aplicar en próximo proyecto.",
    autor: "Egghead.io",
    valoracion: 5
  },
  {
    id: 4,
    titulo: "Metodología PARA Completa",
    descripcion: "PDF con la guía completa de la metodología PARA de Tiago Forte",
    tipo: "documento",
    categoria: "Productividad",
    url: "/documents/metodologia-para.pdf",
    fechaCreacion: "2024-01-05",
    fechaAcceso: "2024-01-22",
    etiquetas: ["PARA", "Productividad", "Organización", "Conocimiento"],
    favorito: true,
    vistas: 15,
    notas: "Base fundamental para implementación del sistema. Revisar capítulos 3 y 7 regularmente.",
    autor: "Tiago Forte",
    valoracion: 5
  },
  {
    id: 5,
    titulo: "API Documentation Best Practices",
    descripcion: "Guía sobre cómo escribir documentación de API clara y útil",
    tipo: "enlace",
    categoria: "Desarrollo",
    url: "https://swagger.io/resources/articles/best-practices-in-api-documentation/",
    fechaCreacion: "2024-01-12",
    fechaAcceso: "2024-01-19",
    etiquetas: ["API", "Documentación", "OpenAPI", "Swagger"],
    favorito: false,
    vistas: 3,
    notas: "Buenas prácticas para documentar endpoints. Implementar en proyecto actual.",
    autor: "Swagger Team",
    valoracion: 4
  },
  {
    id: 6,
    titulo: "Design Tokens in Practice",
    descripcion: "Conferencia sobre implementación práctica de design tokens en organizaciones",
    tipo: "video",
    categoria: "Diseño",
    url: "https://www.youtube.com/watch?v=design-tokens",
    fechaCreacion: "2024-01-14",
    fechaAcceso: "2024-01-21",
    etiquetas: ["Design Tokens", "Escalabilidad", "Equipos", "Implementación"],
    favorito: false,
    vistas: 6,
    notas: "Casos de uso reales y problemas comunes. Muy relevante para nuestro design system.",
    autor: "Design Systems Week",
    valoracion: 4
  },
  {
    id: 7,
    titulo: "Database Optimization Checklist",
    descripcion: "Lista de verificación para optimizar rendimiento de bases de datos",
    tipo: "documento",
    categoria: "Base de Datos",
    url: "/documents/db-optimization.pdf",
    fechaCreacion: "2024-01-06",
    fechaAcceso: "2024-01-17",
    etiquetas: ["Base de Datos", "Optimización", "Performance", "SQL"],
    favorito: true,
    vistas: 9,
    notas: "Checklist muy práctica. Aplicar puntos 1-5 en proyecto de migración.",
    autor: "DB Performance Team",
    valoracion: 5
  },
  {
    id: 8,
    titulo: "Figma Advanced Prototyping",
    descripcion: "Tutorial sobre técnicas avanzadas de prototipado en Figma",
    tipo: "imagen",
    categoria: "Diseño",
    url: "https://figma.com/advanced-prototyping.png",
    fechaCreacion: "2024-01-11",
    fechaAcceso: "2024-01-20",
    etiquetas: ["Figma", "Prototipado", "UX", "Herramientas"],
    favorito: false,
    vistas: 4,
    notas: "Técnicas útiles para prototipos interactivos. Probar en próximo diseño.",
    autor: "Figma Community",
    valoracion: 3
  }
];

const tipos = ["Todos", "documentacion", "articulo", "video", "documento", "enlace", "imagen"];
const categorias = ["Todas", "Desarrollo", "Diseño", "Backend", "Productividad", "Base de Datos"];

export default function Recursos() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [soloFavoritos, setSoloFavoritos] = useState(false);

  const recursosFiltrados = recursos.filter(recurso => {
    const coincideBusqueda = recurso.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                            recurso.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
                            recurso.etiquetas.some(etiqueta => etiqueta.toLowerCase().includes(busqueda.toLowerCase())) ||
                            recurso.autor.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideTipo = filtroTipo === "Todos" || recurso.tipo === filtroTipo;
    const coincideCategoria = filtroCategoria === "Todas" || recurso.categoria === filtroCategoria;
    const coincideFavorito = !soloFavoritos || recurso.favorito;
    
    return coincideBusqueda && coincideTipo && coincideCategoria && coincideFavorito;
  });

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "documentacion":
        return <BookOpen className="h-4 w-4" />;
      case "articulo":
        return <FileText className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "documento":
        return <FileText className="h-4 w-4" />;
      case "enlace":
        return <Link className="h-4 w-4" />;
      case "imagen":
        return <ImageIcon className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "documentacion":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "articulo":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "video":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "documento":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "enlace":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200";
      case "imagen":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (valoracion: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-3 w-3 ${i < valoracion ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-para-resources">Recursos</h1>
          <p className="text-muted-foreground mt-1">
            Tu base de conocimiento personal con referencias y materiales útiles
          </p>
        </div>
        <Button variant="resources" size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Añadir Recurso
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
                  placeholder="Buscar recursos por título, descripción, etiquetas o autor..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                {tipos.map(tipo => (
                  <option key={tipo} value={tipo}>
                    {tipo === "Todos" ? tipo : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </option>
                ))}
              </select>
              
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
              
              <Button
                variant={soloFavoritos ? "resources" : "outline"}
                size="sm"
                onClick={() => setSoloFavoritos(!soloFavoritos)}
                className="gap-1"
              >
                <Star className="h-4 w-4" />
                Favoritos
              </Button>
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
                <p className="text-sm font-medium">Total Recursos</p>
                <p className="text-2xl font-bold">{recursos.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Favoritos</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {recursos.filter(r => r.favorito).length}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Añadidos Este Mes</p>
                <p className="text-2xl font-bold text-green-600">
                  {recursos.filter(r => new Date(r.fechaCreacion).getMonth() === new Date().getMonth()).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Vistas</p>
                <p className="text-2xl font-bold text-blue-600">
                  {recursos.reduce((total, r) => total + r.vistas, 0)}
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {recursosFiltrados.map((recurso, index) => (
          <Card 
            key={recurso.id} 
            className="para-card animate-scale-in hover:shadow-xl transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg leading-tight">{recurso.titulo}</CardTitle>
                    {recurso.favorito && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
                    )}
                  </div>
                  <CardDescription className="text-sm">
                    {recurso.descripcion}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Type and Category */}
              <div className="flex items-center gap-2">
                <Badge className={getTipoColor(recurso.tipo)}>
                  {getTipoIcon(recurso.tipo)}
                  <span className="ml-1 capitalize">{recurso.tipo}</span>
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {recurso.categoria}
                </Badge>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {renderStars(recurso.valoracion)}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({recurso.valoracion}/5)
                </span>
              </div>

              {/* Author and Stats */}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Por {recurso.autor}</span>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{recurso.vistas}</span>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Añadido</p>
                  <p className="font-medium">{formatearFecha(recurso.fechaCreacion)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Último acceso</p>
                  <p className="font-medium">{formatearFecha(recurso.fechaAcceso)}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {recurso.etiquetas.slice(0, 3).map((etiqueta) => (
                  <Badge key={etiqueta} variant="outline" className="text-xs">
                    <Tag className="h-2 w-2 mr-1" />
                    {etiqueta}
                  </Badge>
                ))}
                {recurso.etiquetas.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{recurso.etiquetas.length - 3}
                  </Badge>
                )}
              </div>

              {/* Notes */}
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-sm text-muted-foreground mb-1">Notas</p>
                <p className="text-sm">{recurso.notas}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <ExternalLink className="h-3 w-3" />
                  Abrir
                </Button>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Share className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {recursosFiltrados.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No se encontraron recursos</h3>
            <p className="text-muted-foreground mb-4">
              {busqueda || filtroTipo !== "Todos" || filtroCategoria !== "Todas" || soloFavoritos
                ? "Intenta ajustar los filtros de búsqueda" 
                : "Comienza añadiendo tu primer recurso útil"}
            </p>
            <Button variant="resources" className="gap-2">
              <Plus className="h-4 w-4" />
              Añadir Primer Recurso
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}