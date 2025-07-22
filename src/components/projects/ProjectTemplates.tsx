import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Plus, FileText, Download, Upload, Trash2, Copy, Edit } from "lucide-react";

interface ProjectTemplate {
  id: number;
  name: string;
  description: string;
  category: string;
  tasks: string[];
  estimatedDuration: string;
  tags: string[];
  created: string;
  isDefault: boolean;
}

const defaultTemplates: ProjectTemplate[] = [
  {
    id: 1,
    name: "Desarrollo Web",
    description: "Plantilla para proyectos de desarrollo de aplicaciones web",
    category: "Desarrollo",
    tasks: [
      "Análisis de requisitos",
      "Diseño de wireframes",
      "Desarrollo frontend",
      "Desarrollo backend",
      "Testing",
      "Despliegue"
    ],
    estimatedDuration: "8-12 semanas",
    tags: ["Web", "Frontend", "Backend"],
    created: "2024-01-15",
    isDefault: true
  },
  {
    id: 2,
    name: "Campaña de Marketing",
    description: "Plantilla para campañas de marketing digital",
    category: "Marketing",
    tasks: [
      "Definir objetivos",
      "Investigación de mercado",
      "Crear contenido",
      "Configurar campañas",
      "Lanzamiento",
      "Análisis de resultados"
    ],
    estimatedDuration: "4-6 semanas",
    tags: ["Marketing", "Digital", "Campaña"],
    created: "2024-01-20",
    isDefault: true
  },
  {
    id: 3,
    name: "Investigación Académica",
    description: "Plantilla para proyectos de investigación y papers académicos",
    category: "Académico",
    tasks: [
      "Revisión de literatura",
      "Definir metodología",
      "Recolección de datos",
      "Análisis de datos",
      "Redacción del paper",
      "Revisión y correcciones"
    ],
    estimatedDuration: "12-16 semanas",
    tags: ["Investigación", "Académico", "Paper"],
    created: "2024-01-25",
    isDefault: true
  }
];

export default function ProjectTemplates() {
  const [templates, setTemplates] = useState<ProjectTemplate[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTemplate, setNewTemplate] = useState<Partial<ProjectTemplate>>({
    name: "",
    description: "",
    category: "",
    tasks: [],
    estimatedDuration: "",
    tags: []
  });

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(templates.map(t => t.category))];

  const handleCreateTemplate = () => {
    if (newTemplate.name && newTemplate.description) {
      const template: ProjectTemplate = {
        id: Date.now(),
        name: newTemplate.name,
        description: newTemplate.description,
        category: newTemplate.category || "General",
        tasks: newTemplate.tasks || [],
        estimatedDuration: newTemplate.estimatedDuration || "No especificado",
        tags: newTemplate.tags || [],
        created: new Date().toISOString().split('T')[0],
        isDefault: false
      };
      
      setTemplates(prev => [...prev, template]);
      setNewTemplate({});
      setIsCreateDialogOpen(false);
    }
  };

  const handleDuplicateTemplate = (template: ProjectTemplate) => {
    const duplicated: ProjectTemplate = {
      ...template,
      id: Date.now(),
      name: `${template.name} (Copia)`,
      created: new Date().toISOString().split('T')[0],
      isDefault: false
    };
    
    setTemplates(prev => [...prev, duplicated]);
  };

  const handleDeleteTemplate = (id: number) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const handleExportTemplate = (template: ProjectTemplate) => {
    const data = JSON.stringify(template, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, '_')}_template.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          const template: ProjectTemplate = {
            ...imported,
            id: Date.now(),
            created: new Date().toISOString().split('T')[0],
            isDefault: false
          };
          setTemplates(prev => [...prev, template]);
        } catch (error) {
          console.error('Error importing template:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Plantillas de Proyectos</h2>
        <div className="flex gap-2">
          <label>
            <input
              type="file"
              accept=".json"
              onChange={handleImportTemplate}
              className="hidden"
            />
            <Button variant="outline" className="gap-2 cursor-pointer">
              <Upload className="h-4 w-4" />
              Importar
            </Button>
          </label>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nueva Plantilla
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nueva Plantilla</DialogTitle>
                <DialogDescription>
                  Define una plantilla reutilizable para futuros proyectos
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nombre de la Plantilla</label>
                  <Input
                    value={newTemplate.name || ""}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Desarrollo de App Móvil"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Descripción</label>
                  <Textarea
                    value={newTemplate.description || ""}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe el propósito y alcance de esta plantilla"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Categoría</label>
                    <Input
                      value={newTemplate.category || ""}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Ej: Desarrollo, Marketing, Investigación"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Duración Estimada</label>
                    <Input
                      value={newTemplate.estimatedDuration || ""}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                      placeholder="Ej: 4-6 semanas"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Tareas (una por línea)</label>
                  <Textarea
                    value={newTemplate.tasks?.join('\n') || ""}
                    onChange={(e) => setNewTemplate(prev => ({ 
                      ...prev, 
                      tasks: e.target.value.split('\n').filter(t => t.trim()) 
                    }))}
                    placeholder="Análisis de requisitos&#10;Diseño&#10;Desarrollo&#10;Testing"
                    rows={5}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateTemplate}>
                  Crear Plantilla
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Buscar plantillas por nombre, descripción o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Badge key={category} variant="outline" className="cursor-pointer">
            {category} ({templates.filter(t => t.category === category).length})
          </Badge>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">{template.category}</Badge>
                    {template.isDefault && (
                      <Badge variant="outline">Por defecto</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{template.description}</p>
              
              <div>
                <p className="text-sm font-medium mb-2">Tareas incluidas:</p>
                <div className="space-y-1">
                  {template.tasks.slice(0, 3).map((task, index) => (
                    <p key={index} className="text-xs text-muted-foreground">• {task}</p>
                  ))}
                  {template.tasks.length > 3 && (
                    <p className="text-xs text-muted-foreground">... y {template.tasks.length - 3} más</p>
                  )}
                </div>
              </div>

              <div className="text-sm">
                <p><strong>Duración:</strong> {template.estimatedDuration}</p>
                <p><strong>Creado:</strong> {new Date(template.created).toLocaleDateString('es-ES')}</p>
              </div>

              <div className="flex flex-wrap gap-1">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <FileText className="h-4 w-4 mr-1" />
                  Usar Plantilla
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDuplicateTemplate(template)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleExportTemplate(template)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                {!template.isDefault && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No se encontraron plantillas</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? "Intenta ajustar los términos de búsqueda" 
                : "Comienza creando tu primera plantilla personalizada"}
            </p>
            <Button className="gap-2" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Crear Primera Plantilla
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}