import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Proyecto {
  id: number;
  titulo: string;
  estado: string;
  prioridad: string;
  fechaCreacion: string;
  fechaVencimiento: string;
  progreso: number;
}

interface GanttChartProps {
  proyectos: Proyecto[];
}

export default function GanttChart({ proyectos }: GanttChartProps) {
  const chartData = useMemo(() => {
    const startDates = proyectos.map(p => new Date(p.fechaCreacion));
    const endDates = proyectos.map(p => new Date(p.fechaVencimiento));
    
    const minDate = new Date(Math.min(...startDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...endDates.map(d => d.getTime())));
    
    // Generate weeks
    const weeks = [];
    const current = new Date(minDate);
    current.setDate(current.getDate() - current.getDay()); // Start from Sunday
    
    while (current <= maxDate) {
      weeks.push(new Date(current));
      current.setDate(current.getDate() + 7);
    }
    
    return { weeks, minDate, maxDate };
  }, [proyectos]);

  const getProjectBar = (proyecto: Proyecto) => {
    const start = new Date(proyecto.fechaCreacion);
    const end = new Date(proyecto.fechaVencimiento);
    const { weeks } = chartData;
    
    const totalWeeks = weeks.length;
    const startWeek = weeks.findIndex(week => {
      const weekEnd = new Date(week);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return start >= week && start <= weekEnd;
    });
    
    const endWeek = weeks.findIndex(week => {
      const weekEnd = new Date(week);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return end >= week && end <= weekEnd;
    });
    
    const leftPercent = (startWeek / totalWeeks) * 100;
    const widthPercent = ((endWeek - startWeek + 1) / totalWeeks) * 100;
    
    return { leftPercent, widthPercent };
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "Alta":
        return "bg-red-500";
      case "Media":
        return "bg-orange-500";
      case "Baja":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "En progreso":
        return "bg-blue-500";
      case "Pausado":
        return "bg-yellow-500";
      case "Completado":
        return "bg-green-600";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagrama de Gantt</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Timeline Header */}
          <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground">
            <div className="col-span-4"></div>
            <div className="col-span-8">
              <div className="flex">
                {chartData.weeks.map((week, index) => (
                  <div key={index} className="flex-1 text-center border-l border-border first:border-l-0">
                    {week.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Rows */}
          {proyectos.map((proyecto) => {
            const { leftPercent, widthPercent } = getProjectBar(proyecto);
            
            return (
              <div key={proyecto.id} className="grid grid-cols-12 gap-2 items-center py-2 border-b border-border last:border-b-0">
                {/* Project Info */}
                <div className="col-span-4 space-y-1">
                  <div className="font-medium text-sm truncate">{proyecto.titulo}</div>
                  <div className="flex gap-1">
                    <Badge className={getEstadoColor(proyecto.estado)} variant="secondary">
                      {proyecto.estado}
                    </Badge>
                    <Badge className={getPrioridadColor(proyecto.prioridad)} variant="secondary">
                      {proyecto.prioridad}
                    </Badge>
                  </div>
                </div>

                {/* Timeline Bar */}
                <div className="col-span-8 relative h-8">
                  <div className="absolute inset-0 border border-border rounded bg-muted/30"></div>
                  <div 
                    className={`absolute top-1 bottom-1 rounded ${getEstadoColor(proyecto.estado)} opacity-80`}
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  >
                    <div className="h-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {proyecto.progreso}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress indicator */}
                  <div 
                    className={`absolute top-1 bottom-1 rounded ${getEstadoColor(proyecto.estado)}`}
                    style={{
                      left: `${leftPercent}%`,
                      width: `${(widthPercent * proyecto.progreso) / 100}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}

          {proyectos.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No hay proyectos para mostrar en el diagrama de Gantt
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}