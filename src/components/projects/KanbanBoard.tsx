import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, User, Flag, MoreHorizontal } from "lucide-react";

interface Proyecto {
  id: number;
  titulo: string;
  descripcion: string;
  estado: string;
  prioridad: string;
  fechaCreacion: string;
  fechaVencimiento: string;
  progreso: number;
  etiquetas: string[];
  responsable: string;
}

interface KanbanBoardProps {
  proyectos: Proyecto[];
  onUpdateProyecto: (id: number, newState: string) => void;
}

function SortableCard({ proyecto }: { proyecto: Proyecto }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: proyecto.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="cursor-grab hover:shadow-md transition-all duration-200 mb-3">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-sm font-medium leading-tight">{proyecto.titulo}</CardTitle>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{proyecto.descripcion}</p>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex items-center gap-2">
            <Badge className={getPrioridadColor(proyecto.prioridad)} variant="secondary">
              <Flag className="h-3 w-3 mr-1" />
              {proyecto.prioridad}
            </Badge>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Progreso</span>
              <span className="font-medium">{proyecto.progreso}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5">
              <div 
                className="bg-para-projects h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${proyecto.progreso}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {proyecto.etiquetas.slice(0, 2).map((etiqueta) => (
              <Badge key={etiqueta} variant="outline" className="text-xs px-1.5 py-0.5">
                {etiqueta}
              </Badge>
            ))}
            {proyecto.etiquetas.length > 2 && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                +{proyecto.etiquetas.length - 2}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span className="truncate">{proyecto.responsable}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{new Date(proyecto.fechaVencimiento).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Column({ title, projects, columnId }: { title: string; projects: Proyecto[]; columnId: string }) {
  return (
    <div className="flex-1 min-w-80">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            {title}
            <Badge variant="secondary">{projects.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {projects.map((proyecto) => (
                <SortableCard key={proyecto.id} proyecto={proyecto} />
              ))}
              {projects.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No hay proyectos
                </div>
              )}
            </div>
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
}

export default function KanbanBoard({ proyectos, onUpdateProyecto }: KanbanBoardProps) {
  const [items, setItems] = useState(proyectos);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    // Find the project being dragged
    const activeProject = items.find(p => p.id === active.id);
    if (!activeProject) return;

    // Determine new state based on drop zone
    let newState = activeProject.estado;
    
    // For now, just maintain the current state
    // In a real implementation, you'd determine the new state based on the drop zone
    
    onUpdateProyecto(Number(active.id), newState);
  };

  const enProgreso = items.filter(p => p.estado === "En progreso");
  const pausados = items.filter(p => p.estado === "Pausado");
  const completados = items.filter(p => p.estado === "Completado");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tablero Kanban</h2>
      </div>
      
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4">
          <Column title="En Progreso" projects={enProgreso} columnId="en-progreso" />
          <Column title="Pausado" projects={pausados} columnId="pausado" />
          <Column title="Completado" projects={completados} columnId="completado" />
        </div>
      </DndContext>
    </div>
  );
}