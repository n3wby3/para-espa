import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CrearProyectoFormProps {
  onProjectCreate: (newProject: any) => void;
  onClose: () => void;
}

export function CrearProyectoForm({ onProjectCreate, onClose }: CrearProyectoFormProps) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState("Media");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject = {
      id: Date.now(),
      titulo,
      descripcion,
      estado: "En progreso",
      prioridad,
      fechaCreacion: new Date().toISOString().split("T")[0],
      fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days from now
      progreso: 0,
      etiquetas: ["Nuevo"],
      responsable: "Sin asignar",
    };
    onProjectCreate(newProject);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="titulo">Título del Proyecto</Label>
        <Input
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ej: Rediseño de la página de inicio"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Describe los objetivos y el alcance del proyecto."
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="prioridad">Prioridad</Label>
        <Select value={prioridad} onValueChange={setPrioridad}>
          <SelectTrigger id="prioridad">
            <SelectValue placeholder="Selecciona una prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Alta">Alta</SelectItem>
            <SelectItem value="Media">Media</SelectItem>
            <SelectItem value="Baja">Baja</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">Crear Proyecto</Button>
      </div>
    </form>
  );
}