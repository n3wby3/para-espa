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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Area {
  id: number;
  nombre: string;
}

interface CrearProyectoFormProps {
  onProjectCreate: (newProject: any) => void;
  onClose: () => void;
  areas: Area[];
  onAreaCreate: (newAreaName: string) => void;
}

export function CrearProyectoForm({ onProjectCreate, onClose, areas, onAreaCreate }: CrearProyectoFormProps) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("En progreso");
  const [area, setArea] = useState<number | null>(null);
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split("T")[0]);
  const [fechaTermino, setFechaTermino] = useState("");
  const [prioridad, setPrioridad] = useState("Media");
  const [responsable, setResponsable] = useState("");
  const [openAreaSelector, setOpenAreaSelector] = useState(false);
  const [newAreaName, setNewAreaName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject = {
      id: Date.now(),
      titulo,
      descripcion,
      estado,
      area: area ? areas.find(a => a.id === area)?.nombre : newAreaName,
      fechaCreacion: fechaInicio,
      fechaVencimiento: fechaTermino,
      prioridad,
      responsable,
      progreso: 0,
      etiquetas: ["Nuevo"],
    };
    if (newAreaName && !areas.find(a => a.nombre.toLowerCase() === newAreaName.toLowerCase())) {
      onAreaCreate(newAreaName);
    }
    onProjectCreate(newProject);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="titulo">Título del Proyecto</Label>
        <Input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Rediseño de la página de inicio" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Describe los objetivos y el alcance del proyecto." required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="estado">Estado</Label>
          <Select value={estado} onValueChange={setEstado}>
            <SelectTrigger id="estado"><SelectValue placeholder="Selecciona un estado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="En progreso">En progreso</SelectItem>
              <SelectItem value="En espera">En espera</SelectItem>
              <SelectItem value="Completado">Completado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="area">Área</Label>
          <Popover open={openAreaSelector} onOpenChange={setOpenAreaSelector}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={openAreaSelector} className="w-full justify-between">
                {area ? areas.find((a) => a.id === area)?.nombre : "Selecciona un área"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Busca o crea un área..." onValueChange={setNewAreaName} />
                <CommandList>
                  <CommandEmpty>
                    <Button size="sm" onClick={() => {
                      onAreaCreate(newAreaName);
                      setOpenAreaSelector(false);
                    }}>
                      Crear "{newAreaName}"
                    </Button>
                  </CommandEmpty>
                  <CommandGroup>
                    {areas.map((a) => (
                      <CommandItem key={a.id} value={a.nombre} onSelect={() => {
                        setArea(a.id);
                        setOpenAreaSelector(false);
                      }}>
                        <Check className={cn("mr-2 h-4 w-4", area === a.id ? "opacity-100" : "opacity-0")} />
                        {a.nombre}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
          <Input id="fechaInicio" type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fechaTermino">Fecha de Término</Label>
          <Input id="fechaTermino" type="date" value={fechaTermino} onChange={(e) => setFechaTermino(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prioridad">Prioridad</Label>
          <Select value={prioridad} onValueChange={setPrioridad}>
            <SelectTrigger id="prioridad"><SelectValue placeholder="Selecciona una prioridad" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Alta">Alta</SelectItem>
              <SelectItem value="Media">Media</SelectItem>
              <SelectItem value="Baja">Baja</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="responsable">Responsable</Label>
          <Input id="responsable" value={responsable} onChange={(e) => setResponsable(e.target.value)} placeholder="Ej: Equipo de Diseño" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button type="submit">Crear Proyecto</Button>
      </div>
    </form>
  );
}