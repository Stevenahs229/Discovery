import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { AlertTriangle, CheckCircle, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";

interface Anomaly {
  id: string;
  type: string;
  agent: string;
  binome: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved';
}

interface IAnomaliesProps {
  anomalies: Anomaly[];
  onResolve: (id: string) => void;
}

export function IAnomalies({ anomalies, onResolve }: IAnomaliesProps) {
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);

  const filteredAnomalies = anomalies.filter(anomaly => 
    severityFilter === "all" || anomaly.severity === severityFilter
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high': return 'Élevée';
      case 'medium': return 'Moyenne';
      case 'low': return 'Faible';
      default: return severity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-500';
      case 'reviewed': return 'bg-blue-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'reviewed': return 'Examiné';
      case 'resolved': return 'Résolu';
      default: return status;
    }
  };

  // Timeline data for selected anomaly
  const timelineEvents = [
    { time: '08:35', event: 'Pointage agent principal', status: 'success' },
    { time: '08:42', event: 'Absence binôme détectée', status: 'warning' },
    { time: '09:15', event: 'Tentative de contact', status: 'info' },
    { time: '09:30', event: 'Anomalie signalée', status: 'error' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Anomalies détectées par l'IA</h2>
        <p className="text-gray-600">Surveillance et analyse des comportements suspects</p>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-64">
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Gravité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les gravités</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="low">Faible</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{filteredAnomalies.length} anomalie{filteredAnomalies.length > 1 ? 's' : ''}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gravité élevée</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {anomalies.filter(a => a.severity === 'high').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {anomalies.filter(a => a.status === 'pending').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Résolues</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {anomalies.filter(a => a.status === 'resolved').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Détails des anomalies */}
      <Card>
        <CardHeader>
          <CardTitle>Détails des anomalies</CardTitle>
          <CardDescription>Liste complète des anomalies détectées</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Binôme</TableHead>
                  <TableHead>Gravité</TableHead>
                  <TableHead>Horodatage</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnomalies.map((anomaly) => (
                  <TableRow key={anomaly.id}>
                    <TableCell className="font-medium">{anomaly.type}</TableCell>
                    <TableCell>{anomaly.agent}</TableCell>
                    <TableCell>{anomaly.binome}</TableCell>
                    <TableCell>
                      <Badge variant={getSeverityColor(anomaly.severity)}>
                        {getSeverityText(anomaly.severity)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{anomaly.timestamp}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(anomaly.status)}`} />
                        <span className="text-sm">{getStatusText(anomaly.status)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedAnomaly(anomaly)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {anomaly.status !== 'resolved' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onResolve(anomaly.id)}
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog pour les détails */}
      <Dialog open={selectedAnomaly !== null} onOpenChange={(open) => !open && setSelectedAnomaly(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de l'anomalie</DialogTitle>
            <DialogDescription>
              Historique et timeline du binôme
            </DialogDescription>
          </DialogHeader>
          {selectedAnomaly && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium">{selectedAnomaly.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gravité</p>
                  <Badge variant={getSeverityColor(selectedAnomaly.severity)}>
                    {getSeverityText(selectedAnomaly.severity)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Agent</p>
                  <p className="font-medium">{selectedAnomaly.agent}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Binôme</p>
                  <p className="font-medium">{selectedAnomaly.binome}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedAnomaly.description}</p>
              </div>

              <div>
                <p className="font-medium mb-4">Historique binôme</p>
                <div className="space-y-4">
                  {timelineEvents.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${
                          event.status === 'success' ? 'bg-green-500' :
                          event.status === 'warning' ? 'bg-orange-500' :
                          event.status === 'error' ? 'bg-red-500' :
                          'bg-blue-500'
                        }`} />
                        {index < timelineEvents.length - 1 && (
                          <div className="w-0.5 h-12 bg-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-medium">{event.event}</p>
                        <p className="text-xs text-gray-600">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
