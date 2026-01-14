import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Calendar } from "@/app/components/ui/calendar";
import { Badge } from "@/app/components/ui/badge";
import { Calendar as CalendarIcon, Clock, MapPin, Coffee, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

interface AgendaEvent {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: "travail" | "pause" | "absence";
  site?: string;
  description?: string;
}

interface AgendaIntegreProps {
  accessToken: string | null;
}

export function AgendaIntegre({ accessToken }: AgendaIntegreProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<AgendaEvent[]>([
    {
      id: "1",
      date: new Date(),
      startTime: "08:00",
      endTime: "12:00",
      type: "travail",
      site: "Paris - Bâtiment A",
    },
    {
      id: "2",
      date: new Date(),
      startTime: "12:00",
      endTime: "13:00",
      type: "pause",
      description: "Pause déjeuner",
    },
    {
      id: "3",
      date: new Date(),
      startTime: "13:00",
      endTime: "17:00",
      type: "travail",
      site: "Paris - Bâtiment A",
    },
  ]);

  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    startTime: "",
    endTime: "",
    type: "travail" as AgendaEvent["type"],
    site: "",
    description: "",
  });

  const handleAddEvent = () => {
    if (!newEvent.startTime || !newEvent.endTime) {
      toast.error("Veuillez renseigner les horaires");
      return;
    }

    const event: AgendaEvent = {
      id: Date.now().toString(),
      date: selectedDate,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      type: newEvent.type,
      site: newEvent.site,
      description: newEvent.description,
    };

    setEvents([...events, event]);
    setShowAddEvent(false);
    setNewEvent({
      startTime: "",
      endTime: "",
      type: "travail",
      site: "",
      description: "",
    });
    toast.success("Événement ajouté à l'agenda");
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
    toast.success("Événement supprimé");
  };

  const getEventTypeColor = (type: AgendaEvent["type"]) => {
    switch (type) {
      case "travail":
        return "bg-orange-500";
      case "pause":
        return "bg-blue-500";
      case "absence":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getEventTypeIcon = (type: AgendaEvent["type"]) => {
    switch (type) {
      case "travail":
        return <Clock className="w-4 h-4" />;
      case "pause":
        return <Coffee className="w-4 h-4" />;
      case "absence":
        return <CalendarIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const todayEvents = events.filter(
    (event) =>
      format(event.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
  );

  const calculateWorkTime = () => {
    const workEvents = todayEvents.filter((e) => e.type === "travail");
    let totalMinutes = 0;

    workEvents.forEach((event) => {
      const [startHour, startMin] = event.startTime.split(":").map(Number);
      const [endHour, endMin] = event.endTime.split(":").map(Number);
      const start = startHour * 60 + startMin;
      const end = endHour * 60 + endMin;
      totalMinutes += end - start;
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes > 0 ? minutes : ""}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-orange-500" />
            Agenda de Travail
          </CardTitle>
          <CardDescription>
            Planifiez vos horaires, pauses et absences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Calendrier */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                locale={fr}
                className="rounded-md border"
              />
            </div>

            {/* Événements du jour */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">
                    {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Temps de travail: {calculateWorkTime()}
                  </p>
                </div>
                <Button
                  onClick={() => setShowAddEvent(!showAddEvent)}
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>

              {/* Formulaire d'ajout */}
              {showAddEvent && (
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Heure de début</Label>
                        <Input
                          type="time"
                          value={newEvent.startTime}
                          onChange={(e) =>
                            setNewEvent({ ...newEvent, startTime: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Heure de fin</Label>
                        <Input
                          type="time"
                          value={newEvent.endTime}
                          onChange={(e) =>
                            setNewEvent({ ...newEvent, endTime: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select
                        value={newEvent.type}
                        onValueChange={(value: AgendaEvent["type"]) =>
                          setNewEvent({ ...newEvent, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="travail">Travail</SelectItem>
                          <SelectItem value="pause">Pause</SelectItem>
                          <SelectItem value="absence">Absence</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {newEvent.type === "travail" && (
                      <div className="space-y-2">
                        <Label>Site</Label>
                        <Select
                          value={newEvent.site}
                          onValueChange={(value) =>
                            setNewEvent({ ...newEvent, site: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un site" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Paris - Bâtiment A">
                              Paris - Bâtiment A
                            </SelectItem>
                            <SelectItem value="Lyon - Centre">
                              Lyon - Centre
                            </SelectItem>
                            <SelectItem value="Marseille - Port">
                              Marseille - Port
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Description (optionnel)</Label>
                      <Input
                        value={newEvent.description}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, description: e.target.value })
                        }
                        placeholder="Détails de l'événement"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleAddEvent}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        Enregistrer
                      </Button>
                      <Button
                        onClick={() => setShowAddEvent(false)}
                        variant="outline"
                      >
                        Annuler
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Liste des événements */}
              <div className="space-y-2">
                {todayEvents.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Aucun événement prévu ce jour
                  </p>
                ) : (
                  todayEvents
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg ${getEventTypeColor(
                              event.type
                            )} flex items-center justify-center text-white`}
                          >
                            {getEventTypeIcon(event.type)}
                          </div>
                          <div>
                            <p className="font-medium">
                              {event.startTime} - {event.endTime}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Badge variant="outline">{event.type}</Badge>
                              {event.site && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {event.site}
                                </span>
                              )}
                              {event.description && (
                                <span className="text-gray-500">
                                  {event.description}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
