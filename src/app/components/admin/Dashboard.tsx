import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertCircle, TrendingUp, Users, MapPin, Clock } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";

interface DashboardProps {
  stats: {
    totalAgents: number;
    presentToday: number;
    waitingValidation: number;
    anomalies: number;
    coherenceScore: number;
  };
}

export function Dashboard({ stats }: DashboardProps) {
  // Données de présence en temps réel
  const presenceData = [
    { hour: '08:00', present: 45, waiting: 3, absent: 5 },
    { hour: '09:00', present: 48, waiting: 2, absent: 2 },
    { hour: '10:00', present: 47, waiting: 1, absent: 3 },
    { hour: '11:00', present: 49, waiting: 0, absent: 1 },
    { hour: '12:00', present: 42, waiting: 2, absent: 8 },
    { hour: '14:00', present: 46, waiting: 1, absent: 4 },
    { hour: '15:00', present: 48, waiting: 0, absent: 2 },
    { hour: '16:00', present: 47, waiting: 1, absent: 3 },
  ];

  // Score cohérence binômes
  const coherenceData = [
    { name: 'Excellent', value: 35, color: '#10b981' },
    { name: 'Bon', value: 28, color: '#3b82f6' },
    { name: 'Moyen', value: 15, color: '#f59e0b' },
    { name: 'Faible', value: 5, color: '#ef4444' },
  ];

  // Anomalies récentes
  const anomalies = [
    { id: 1, type: 'Pointage suspect', agent: 'Jean Martin', severity: 'high', time: 'Il y a 15 min' },
    { id: 2, type: 'Absence binôme', agent: 'Marie Dupont', severity: 'medium', time: 'Il y a 1h' },
    { id: 3, type: 'Localisation incohérente', agent: 'Luc Petit', severity: 'high', time: 'Il y a 2h' },
    { id: 4, type: 'Validation tardive', agent: 'Sophie Bernard', severity: 'low', time: 'Il y a 3h' },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-destructive';
      case 'medium': return 'bg-secondary';
      case 'low': return 'bg-yellow-500';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAgents}</div>
            <p className="text-xs text-muted-foreground">Actifs dans le système</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Présents</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.presentToday}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.presentToday / stats.totalAgents) * 100)}% validés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.waitingValidation}</div>
            <p className="text-xs text-muted-foreground">Validation binôme</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anomalies</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.anomalies}</div>
            <p className="text-xs text-muted-foreground">Dernières 24h</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Présence en temps réel */}
        <Card>
          <CardHeader>
            <CardTitle>Présence en temps réel</CardTitle>
            <CardDescription>Évolution de la présence aujourd'hui</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={presenceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#2C5F4D" name="Présents" />
                <Bar dataKey="waiting" fill="#F59E0B" name="En attente" />
                <Bar dataKey="absent" fill="#DC2626" name="Absents" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Score cohérence binômes */}
        <Card>
          <CardHeader>
            <CardTitle>Score cohérence binômes</CardTitle>
            <CardDescription>Répartition de la qualité des binômes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={coherenceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {coherenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Anomalies IA */}
      <Card>
        <CardHeader>
          <CardTitle>Anomalies détectées par l'IA</CardTitle>
          <CardDescription>Alertes récentes nécessitant une attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {anomalies.map((anomaly) => (
              <div key={anomaly.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getSeverityColor(anomaly.severity)}`} />
                  <div>
                    <p className="font-medium">{anomaly.type}</p>
                    <p className="text-sm text-muted-foreground">{anomaly.agent}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{anomaly.time}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}