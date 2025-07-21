import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Archive, 
  RotateCcw,
  Trash2,
  Calendar,
  FolderOpen,
  ArrowUpRight,
  MoreHorizontal,
  Filter,
  Download,
  Eye,
  FileText,
  FolderKanban,
  Target,
  BookOpen
} from "lucide-react";

// Datos de ejemplo para archivo
const elementosArchivados = [
  {
    id: 1,
    titulo: "Proyecto App Mobile v1.0",
    descripcion: "Primera versión de la aplicación móvil completada en Q4 2023",
    tipoOriginal: "proyecto",
    categoriaOriginal: "Desarrollo",
    fechaArchivado: "2024-01-15",
    fechaOriginal: "2023-12-20",
    motivoArchivo: "Proyecto completado exitosamente",
    etiquetas: ["Móvil", "React Native", "Completado"],
    tamano: "2.3 MB",
    adjuntos: 15,
    notas: "Proyecto base para futuras iteraciones. Documentación completa disponible.",
    archivoFisico: true
  },
  {
    id: 2,
    titulo: "Documentación API Legacy",
    descripcion: "Documentación de la API antigua antes de migración a GraphQL",
    tipoOriginal: "recurso",
    categoriaOriginal: "Backend",
    fechaArchivado: "2024-01-10",
    fechaOriginal: "2023-08-15",
    motivoArchivo: "Reemplazado por nueva implementación",
    etiquetas: ["API", "REST", "Legacy", "Documentación"],
    tamano: "1.1 MB",
    adjuntos: 8,
    notas: "Mantener como referencia histórica. Algunos endpoints aún activos en versión de compatibilidad.",
    archivoFisico: true
  },
  {
    id: 3,
    titulo: "Área: Marketing Digital",
    descripcion: "Área de responsabilidad discontinuada tras restructuración organizacional",
    tipoOriginal: "area",
    categoriaOriginal: "Marketing",
    fechaArchivado: "2024-01-08",
    fechaOriginal: "2023-03-01",
    motivoArchivo: "Cambio en estructura organizacional",
    etiquetas: ["Marketing", "Social Media", "SEO", "Restructuración"],
    tamano: "875 KB",
    adjuntos: 12,
    notas: "KPIs y métricas históricas preservadas. Responsabilidad transferida a equipo especializado.",
    archivoFisico: false
  },
  {
    id: 4,
    titulo: "Tutorial: Vue.js Setup 2022",
    descripcion: "Guía de configuración de Vue.js que quedó obsoleta tras actualización",
    tipoOriginal: "recurso",
    categoriaOriginal: "Frontend",
    fechaArchivado: "2024-01-05",
    fechaOriginal: "2022-11-10",
    motivoArchivo: "Información obsoleta",
    etiquetas: ["Vue.js", "Setup", "Obsoleto", "2022"],
    tamano: "450 KB",
    adjuntos: 3,
    notas: "Reemplazado por guía actualizada para Vue 3. Mantener como referencia histórica.",
    archivoFisico: true
  },
  {
    id: 5,
    titulo: "Prototipo Dashboard Analytics",
    descripción: "Diseños iniciales del dashboard que no se implementaron",
    tipoOriginal: "proyecto",
    categoriaOriginal: "Diseño",
    fechaArchivado: "2024-01-12",
    fechaOriginal: "2023-09-05",
    motivoArchivo: "Cancelado por cambio de prioridades",
    etiquetas: ["Dashboard", "Analytics", "Prototipo", "Cancelado"],
    tamano: "3.2 MB",
    adjuntos: 20,
    notas: "Diseños interesantes que podrían reutilizarse en futuros proyectos. Figma files preservados.",
    archivoFisico: true
  },
  {
    id: 6,
    titulo: "Área: Gestión de Proveedores",
    descripcion: "Responsabilidad transferida a departamento de compras",
    tipoOriginal: "area",
    categoriaOriginal: "Operaciones",
    fechaArchivado: "2024-01-03",
    fechaOriginal: "2023-01-15",
    motivoArchivo: "Transferencia de responsabilidad",
    etiquetas: ["Proveedores", "Compras", "Operaciones", "Transferido"],
    tamano: "1.8 MB",
    adjuntos: 25,
    notas: "Proceso completo documentado. Contactos y procedimientos transferidos correctamente.",
    archivoFisico: false
  },
  {
    id: 7,
    titulo: "Investigación: Tecnologías Blockchain",
    descripcion: "Estudio de viabilidad de blockchain que no procedió",
    tipoOriginal: "recurso",
    categoriaOriginal: "Investigación",
    fechaArchivado: "2024-01-07",
    fechaOriginal: "2023-06-20",
    motivoArchivo: "No viable para el negocio actual",
    etiquetas: ["Blockchain", "Investigación", "Viabilidad", "Descartado"],
    tamano: "2.7 MB",
    adjuntos: 18,
    notas: "Investigación exhaustiva con conclusiones válidas. Mantener para futuras referencias.",
    archivoFisico: true
  },
  {
    id: 8,
    titulo: "Campaña Q3 2023",
    descripcion: "Proyecto de campaña de marketing completado en Q3",
    tipoOriginal: "proyecto",
    categoriaOriginal: "Marketing",
    fechaArchivado: "2024-01-01",
    fechaOriginal: "2023-09-30",
    motivoArchivo: "Proyecto completado exitosamente",
    etiquetas: ["Campaña", "Q3", "Marketing", "Completado"],
    tamano: "4.1 MB",
    adjuntos: 30,
    notas: "Excelentes resultados. Usar como template para futuras campañas similares.",
    archivoFisico: true
  }
];

const tiposOriginales = ["Todos", "proyecto", "area", "recurso"];
const motivosArchivo = ["Todos", "Proyecto completado exitosamente", "Reemplazado por nueva implementación", "Cambio en estructura organizacional", "Información obsoleta", "Cancelado por cambio de prioridades", "Transferencia de responsabilidad", "No viable para el negocio actual"];

export default function Archivo() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroMotivo, setFiltroMotivo] = useState("Todos");
  const [soloConAdjuntos, setSoloConAdjuntos] = useState(false);

  const elementosFiltrados = elementosArchivados.filter(elemento => {
    const coincideBusqueda = elemento.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                            elemento.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
                            elemento.etiquetas.some(etiqueta => etiqueta.toLowerCase().includes(busqueda.toLowerCase())) ||
                            elemento.categoriaOriginal.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideTipo = filtroTipo === "Todos" || elemento.tipoOriginal === filtroTipo;
    const coincideMotivo = filtroMotivo === "Todos" || elemento.motivoArchivo === filtroMotivo;
    const coincideAdjuntos = !soloConAdjuntos || elemento.adjuntos > 0;
    
    return coincideBusqueda && coincideTipo && coincideMotivo && coincideAdjuntos;
  });

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "proyecto":
        return <FolderKanban className="h-4 w-4" />;
      case "area":
        return <Target className="h-4 w-4" />;
      case "recurso":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "proyecto":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "area":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "recurso":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getMotivoColor = (motivo: string) => {
    if (motivo.includes("completado") || motivo.includes("exitosamente")) {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    } else if (motivo.includes("obsoleta") || motivo.includes("reemplazado")) {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    } else if (motivo.includes("cancelado") || motivo.includes("no viable")) {
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    } else {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatearTamano = (tamano: string) => {
    return tamano;
  };

  const diasEnArchivo = (fechaArchivado: string) => {
    const hoy = new Date();
    const archivo = new Date(fechaArchivado);
    const diferencia = Math.ceil((hoy.getTime() - archivo.getTime()) / (1000 * 3600 * 24));
    return diferencia;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-para-archive">Archivo</h1>
          <p className="text-muted-foreground mt-1">
            Elementos completados, obsoletos o que ya no son relevantes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="lg" className="gap-2">
            <Download className="h-5 w-5" />
            Exportar Todo
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <Filter className="h-5 w-5" />
            Filtros Avanzados
          </Button>
        </div>
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
                  placeholder="Buscar en archivo por título, descripción, etiquetas..."
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
                {tiposOriginales.map(tipo => (
                  <option key={tipo} value={tipo}>
                    {tipo === "Todos" ? tipo : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </option>
                ))}
              </select>
              
              <Button
                variant={soloConAdjuntos ? "archive" : "outline"}
                size="sm"
                onClick={() => setSoloConAdjuntos(!soloConAdjuntos)}
                className="gap-1"
              >
                <FolderOpen className="h-4 w-4" />
                Con Adjuntos
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
                <p className="text-sm font-medium">Total Archivados</p>
                <p className="text-2xl font-bold">{elementosArchivados.length}</p>
              </div>
              <Archive className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Con Archivos</p>
                <p className="text-2xl font-bold text-blue-600">
                  {elementosArchivados.filter(e => e.archivoFisico).length}
                </p>
              </div>
              <FolderOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Este Mes</p>
                <p className="text-2xl font-bold text-green-600">
                  {elementosArchivados.filter(e => new Date(e.fechaArchivado).getMonth() === new Date().getMonth()).length}
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
                <p className="text-sm font-medium">Total Adjuntos</p>
                <p className="text-2xl font-bold text-purple-600">
                  {elementosArchivados.reduce((total, e) => total + e.adjuntos, 0)}
                </p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Archive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {elementosFiltrados.map((elemento, index) => {
          const dias = diasEnArchivo(elemento.fechaArchivado);
          
          return (
            <Card 
              key={elemento.id} 
              className="para-card animate-scale-in hover:shadow-xl transition-all duration-300 border-l-4 border-para-archive"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{elemento.titulo}</CardTitle>
                      {elemento.archivoFisico && (
                        <FolderOpen className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <CardDescription>
                      {elemento.descripcion}
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
                  <Badge className={getTipoColor(elemento.tipoOriginal)}>
                    {getTipoIcon(elemento.tipoOriginal)}
                    <span className="ml-1 capitalize">{elemento.tipoOriginal}</span>
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {elemento.categoriaOriginal}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {dias} días archivado
                  </Badge>
                </div>

                {/* Archive Reason */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Motivo del archivo:</p>
                  <Badge className={getMotivoColor(elemento.motivoArchivo)} variant="outline">
                    {elemento.motivoArchivo}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-1">Adjuntos</p>
                    <p className="font-bold text-lg">{elemento.adjuntos}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground mb-1">Tamaño</p>
                    <p className="font-bold text-lg">{formatearTamano(elemento.tamano)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground mb-1">Duración</p>
                    <p className="font-bold text-lg">
                      {Math.ceil((new Date(elemento.fechaArchivado).getTime() - new Date(elemento.fechaOriginal).getTime()) / (1000 * 3600 * 24 * 30))}m
                    </p>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Creado</p>
                    <p className="font-medium">{formatearFecha(elemento.fechaOriginal)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Archivado</p>
                    <p className="font-medium">{formatearFecha(elemento.fechaArchivado)}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {elemento.etiquetas.slice(0, 3).map((etiqueta) => (
                    <Badge key={etiqueta} variant="outline" className="text-xs">
                      {etiqueta}
                    </Badge>
                  ))}
                  {elemento.etiquetas.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{elemento.etiquetas.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Notes */}
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground mb-1">Notas del archivo</p>
                  <p className="text-sm">{elemento.notas}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Eye className="h-3 w-3" />
                    Ver Detalles
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <RotateCcw className="h-3 w-3" />
                    Restaurar
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button variant="destructive" size="sm" className="gap-1">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {elementosFiltrados.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No se encontraron elementos archivados</h3>
            <p className="text-muted-foreground mb-4">
              {busqueda || filtroTipo !== "Todos" || soloConAdjuntos
                ? "Intenta ajustar los filtros de búsqueda" 
                : "El archivo está vacío. Los elementos archivados aparecerán aquí."}
            </p>
            {!busqueda && filtroTipo === "Todos" && !soloConAdjuntos && (
              <Button variant="outline" className="gap-2">
                <ArrowUpRight className="h-4 w-4" />
                Explorar Proyectos Activos
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}