import { apiClient } from './apiClient';
import type { Task } from '../models/Task';
import { Station } from '../models/Task';

/**
 * Servicio para manejar operaciones de tareas
 */
class TaskService {
  /**
   * Obtiene tareas de una estación específica
   */
  async getTasksByStation(station: Station): Promise<Task[]> {
    return apiClient.get<Task[]>(`/api/tasks/station/${station}`);
  }

  /**
   * Obtiene todas las tareas de todas las estaciones
   */
  async getAllTasks(): Promise<Task[]> {
    const [espressoTasks, pastryTasks, sandwichTasks] = await Promise.all([
      this.getTasksByStation(Station.ESPRESSO_BAR),
      this.getTasksByStation(Station.PASTRY_STATION),
      this.getTasksByStation(Station.SANDWICH_STATION),
    ]);

    return [...espressoTasks, ...pastryTasks, ...sandwichTasks];
  }

  /**
   * Inicia la preparación de una tarea
   */
  async startTask(taskId: number): Promise<Task> {
    return apiClient.patch<Task>(`/api/tasks/${taskId}/start`);
  }
}

export const taskService = new TaskService();
