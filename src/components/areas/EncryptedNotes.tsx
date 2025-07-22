import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import CryptoJS from 'crypto-js';
import { 
  Lock,
  Unlock,
  Save,
  Eye,
  EyeOff,
  Shield,
  Key,
  FileText,
  Download,
  Upload,
  Clock
} from "lucide-react";

interface EncryptedNote {
  id: number;
  title: string;
  content: string;
  isEncrypted: boolean;
  lastModified: Date;
  category: string;
  tags: string[];
  syncStatus: 'synced' | 'pending' | 'conflict' | 'offline';
}

interface EncryptedNotesProps {
  areaId: number;
  areaName: string;
}

const defaultNotes: EncryptedNote[] = [
  {
    id: 1,
    title: "Estrategia confidencial Q1",
    content: "U2FsdGVkX19+YqKcCJ1Z8J1Z8J1Z8J1Z8J1Z8J1Z8J1Z8J1Z8",
    isEncrypted: true,
    lastModified: new Date('2024-01-20T10:30:00'),
    category: "Estrategia",
    tags: ["confidencial", "q1", "planificación"],
    syncStatus: 'synced'
  },
  {
    id: 2,
    title: "Feedback del equipo",
    content: "Notas de las reuniones 1:1 con el equipo. Juan mostró preocupación por la carga de trabajo...",
    isEncrypted: false,
    lastModified: new Date('2024-01-22T15:45:00'),
    category: "Equipo",
    tags: ["feedback", "1:1", "seguimiento"],
    syncStatus: 'pending'
  },
  {
    id: 3,
    title: "Análisis de competencia",
    content: "U2FsdGVkX1+vupSqp9UnP3cQExNI1WcJMLCm4B1Z8J1Z8J1Z8",
    isEncrypted: true,
    lastModified: new Date('2024-01-18T09:15:00'),
    category: "Investigación",
    tags: ["competencia", "análisis", "mercado"],
    syncStatus: 'offline'
  }
];

export default function EncryptedNotes({ areaId, areaName }: EncryptedNotesProps) {
  const [notes, setNotes] = useState<EncryptedNote[]>(defaultNotes);
  const [selectedNote, setSelectedNote] = useState<EncryptedNote | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [decryptedContent, setDecryptedContent] = useState("");
  const [isDecrypted, setIsDecrypted] = useState(false);

  // Auto-backup every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      backupNotes();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [notes]);

  const encryptContent = (content: string, password: string): string => {
    return CryptoJS.AES.encrypt(content, password).toString();
  };

  const decryptContent = (encryptedContent: string, password: string): string => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedContent, password);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      throw new Error('Contraseña incorrecta');
    }
  };

  const handleDecrypt = (note: EncryptedNote) => {
    if (!password) {
      alert('Por favor, ingresa la contraseña');
      return;
    }

    try {
      const decrypted = decryptContent(note.content, password);
      setDecryptedContent(decrypted);
      setIsDecrypted(true);
    } catch (error) {
      alert('Contraseña incorrecta');
      setPassword("");
    }
  };

  const handleEncrypt = (content: string) => {
    if (!password) {
      alert('Por favor, ingresa una contraseña');
      return;
    }

    const encrypted = encryptContent(content, password);
    
    if (selectedNote) {
      setNotes(prev => prev.map(note => 
        note.id === selectedNote.id 
          ? { 
              ...note, 
              content: encrypted,
              isEncrypted: true,
              lastModified: new Date(),
              syncStatus: 'pending' as const
            }
          : note
      ));
    }
    
    setIsDecrypted(false);
    setPassword("");
  };

  const saveNote = (content: string) => {
    if (!selectedNote) return;

    setNotes(prev => prev.map(note => 
      note.id === selectedNote.id 
        ? { 
            ...note, 
            content: note.isEncrypted ? note.content : content,
            lastModified: new Date(),
            syncStatus: 'pending' as const
          }
        : note
    ));
    
    // If note is encrypted, update the decrypted content
    if (selectedNote.isEncrypted) {
      setDecryptedContent(content);
    }
    
    setIsEditing(false);
  };

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'conflict': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'offline': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getSyncStatusText = (status: string) => {
    switch (status) {
      case 'synced': return 'Sincronizado';
      case 'pending': return 'Pendiente';
      case 'conflict': return 'Conflicto';
      case 'offline': return 'Sin conexión';
      default: return status;
    }
  };

  const backupNotes = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      areaId,
      areaName,
      notes: notes.map(note => ({
        ...note,
        lastModified: note.lastModified.toISOString()
      }))
    };
    
    localStorage.setItem(`areas_backup_${areaId}`, JSON.stringify(backup));
    console.log('Backup automático realizado');
  };

  const exportNotes = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      areaName,
      notes: notes.map(note => ({
        ...note,
        lastModified: note.lastModified.toISOString(),
        content: note.isEncrypted ? '[CONTENIDO ENCRIPTADO]' : note.content
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notas_${areaName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importNotes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          const importedNotes = imported.notes.map((note: any) => ({
            ...note,
            id: Date.now() + Math.random(),
            lastModified: new Date(note.lastModified),
            syncStatus: 'pending' as const
          }));
          
          setNotes(prev => [...prev, ...importedNotes]);
        } catch (error) {
          alert('Error al importar las notas');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Notas Encriptadas</h2>
        <div className="flex gap-2">
          <Badge variant="outline">{areaName}</Badge>
          <label>
            <input
              type="file"
              accept=".json"
              onChange={importNotes}
              className="hidden"
            />
            <Button variant="outline" className="gap-2 cursor-pointer">
              <Upload className="h-4 w-4" />
              Importar
            </Button>
          </label>
          <Button variant="outline" onClick={exportNotes} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            Nueva Nota
          </Button>
        </div>
      </div>

      {/* Notes Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Notas</p>
                <p className="text-2xl font-bold text-para-areas">{notes.length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Encriptadas</p>
                <p className="text-2xl font-bold text-green-600">
                  {notes.filter(n => n.isEncrypted).length}
                </p>
              </div>
              <Lock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Pendientes Sync</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {notes.filter(n => n.syncStatus === 'pending').length}
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
                <p className="text-sm font-medium">Sin Conexión</p>
                <p className="text-2xl font-bold text-gray-600">
                  {notes.filter(n => n.syncStatus === 'offline').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Lista de Notas</h3>
          {notes.map(note => (
            <Card 
              key={note.id}
              className={`cursor-pointer hover:shadow-lg transition-all duration-300 ${
                selectedNote?.id === note.id ? 'ring-2 ring-para-areas/20' : ''
              }`}
              onClick={() => {
                setSelectedNote(note);
                setIsDecrypted(false);
                setPassword("");
                setDecryptedContent("");
              }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{note.title}</CardTitle>
                      {note.isEncrypted ? (
                        <Lock className="h-4 w-4 text-green-600" />
                      ) : (
                        <Unlock className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div className="flex gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {note.category}
                      </Badge>
                      <Badge className={`text-xs ${getSyncStatusColor(note.syncStatus)}`}>
                        {getSyncStatusText(note.syncStatus)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* Preview */}
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-sm">
                    {note.isEncrypted 
                      ? '🔒 Contenido encriptado - Ingresa contraseña para ver'
                      : note.content.slice(0, 100) + (note.content.length > 100 ? '...' : '')
                    }
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {note.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Last Modified */}
                <p className="text-xs text-muted-foreground">
                  Modificado: {note.lastModified.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Note Viewer/Editor */}
        <div className="space-y-4">
          {selectedNote ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {selectedNote.title}
                    {selectedNote.isEncrypted ? (
                      <Lock className="h-5 w-5 text-green-600" />
                    ) : (
                      <Unlock className="h-5 w-5 text-gray-600" />
                    )}
                  </CardTitle>
                  <div className="flex gap-2">
                    {!isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        Editar
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Password Input for Encrypted Notes */}
                {selectedNote.isEncrypted && !isDecrypted && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Contraseña para desencriptar"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-9 pr-9 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          onKeyDown={(e) => e.key === 'Enter' && handleDecrypt(selectedNote)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <Button onClick={() => handleDecrypt(selectedNote)}>
                        <Unlock className="h-4 w-4 mr-1" />
                        Desencriptar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Content Display/Editor */}
                {(!selectedNote.isEncrypted || isDecrypted) && (
                  <div className="space-y-3">
                    {isEditing ? (
                      <div className="space-y-3">
                        <Textarea
                          value={selectedNote.isEncrypted ? decryptedContent : selectedNote.content}
                          onChange={(e) => {
                            if (selectedNote.isEncrypted) {
                              setDecryptedContent(e.target.value);
                            } else {
                              setSelectedNote({
                                ...selectedNote,
                                content: e.target.value
                              });
                            }
                          }}
                          rows={15}
                          className="min-h-[400px] font-mono text-sm"
                        />
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => {
                              if (selectedNote.isEncrypted) {
                                handleEncrypt(decryptedContent);
                              } else {
                                saveNote(selectedNote.content);
                              }
                            }}
                            className="gap-2"
                          >
                            <Save className="h-4 w-4" />
                            Guardar
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancelar
                          </Button>
                          {!selectedNote.isEncrypted && (
                            <Button
                              variant="outline"
                              onClick={() => handleEncrypt(selectedNote.content)}
                              className="gap-2"
                            >
                              <Lock className="h-4 w-4" />
                              Encriptar
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-muted/30 rounded-lg p-4">
                        <pre className="whitespace-pre-wrap text-sm">
                          {selectedNote.isEncrypted ? decryptedContent : selectedNote.content}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Note Metadata */}
                <div className="border-t pt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Categoría:</span>
                    <span>{selectedNote.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estado de sincronización:</span>
                    <Badge className={getSyncStatusColor(selectedNote.syncStatus)}>
                      {getSyncStatusText(selectedNote.syncStatus)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Última modificación:</span>
                    <span>{selectedNote.lastModified.toLocaleString('es-ES')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Selecciona una nota</h3>
                <p className="text-muted-foreground">
                  Elige una nota de la lista para ver o editar su contenido
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {notes.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay notas</h3>
            <p className="text-muted-foreground mb-4">
              Comienza creando notas seguras para esta área
            </p>
            <Button className="gap-2">
              <FileText className="h-4 w-4" />
              Crear Primera Nota
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}