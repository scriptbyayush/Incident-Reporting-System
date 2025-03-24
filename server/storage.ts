import { 
  users, incidents, comments, notifications,
  type User, type InsertUser, 
  type Incident, type InsertIncident,
  type Comment, type InsertComment,
  type Notification, type InsertNotification
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Incident operations
  getIncidents(): Promise<Incident[]>;
  getIncident(id: number): Promise<Incident | undefined>;
  getIncidentsByStatus(status: string): Promise<Incident[]>;
  getIncidentsByPriority(priority: string): Promise<Incident[]>;
  getIncidentsByReporter(userId: number): Promise<Incident[]>;
  getIncidentsByAssignee(userId: number): Promise<Incident[]>;
  createIncident(incident: InsertIncident): Promise<Incident>;
  updateIncident(id: number, incident: Partial<Incident>): Promise<Incident | undefined>;
  deleteIncident(id: number): Promise<boolean>;
  
  // Comment operations
  getCommentsByIncident(incidentId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Notification operations
  getNotificationsByUser(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private incidents: Map<number, Incident>;
  private comments: Map<number, Comment>;
  private notifications: Map<number, Notification>;
  public sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private incidentIdCounter: number;
  private commentIdCounter: number;
  private notificationIdCounter: number;

  constructor() {
    this.users = new Map();
    this.incidents = new Map();
    this.comments = new Map();
    this.notifications = new Map();
    
    this.userIdCounter = 1;
    this.incidentIdCounter = 1;
    this.commentIdCounter = 1;
    this.notificationIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24hrs
    });
    
    // Create initial admin user
    this.createUser({
      username: "admin",
      password: "$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa", // "password"
      email: "admin@example.com",
      name: "Admin User",
      role: "admin"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Incident methods
  async getIncidents(): Promise<Incident[]> {
    return Array.from(this.incidents.values());
  }

  async getIncident(id: number): Promise<Incident | undefined> {
    return this.incidents.get(id);
  }

  async getIncidentsByStatus(status: string): Promise<Incident[]> {
    return Array.from(this.incidents.values()).filter(
      (incident) => incident.status === status
    );
  }

  async getIncidentsByPriority(priority: string): Promise<Incident[]> {
    return Array.from(this.incidents.values()).filter(
      (incident) => incident.priority === priority
    );
  }

  async getIncidentsByReporter(userId: number): Promise<Incident[]> {
    return Array.from(this.incidents.values()).filter(
      (incident) => incident.reportedBy === userId
    );
  }

  async getIncidentsByAssignee(userId: number): Promise<Incident[]> {
    return Array.from(this.incidents.values()).filter(
      (incident) => incident.assignedTo === userId
    );
  }

  async createIncident(insertIncident: InsertIncident): Promise<Incident> {
    const id = this.incidentIdCounter++;
    const now = new Date();
    const incident: Incident = { 
      ...insertIncident, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.incidents.set(id, incident);
    return incident;
  }

  async updateIncident(id: number, incidentData: Partial<Incident>): Promise<Incident | undefined> {
    const incident = this.incidents.get(id);
    if (!incident) return undefined;
    
    const updatedIncident = { 
      ...incident, 
      ...incidentData,
      updatedAt: new Date()
    };
    this.incidents.set(id, updatedIncident);
    return updatedIncident;
  }

  async deleteIncident(id: number): Promise<boolean> {
    return this.incidents.delete(id);
  }

  // Comment methods
  async getCommentsByIncident(incidentId: number): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(
      (comment) => comment.incidentId === incidentId
    );
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.commentIdCounter++;
    const now = new Date();
    const comment: Comment = { 
      ...insertComment, 
      id,
      createdAt: now
    };
    this.comments.set(id, comment);
    return comment;
  }

  // Notification methods
  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(
      (notification) => notification.userId === userId
    );
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.notificationIdCounter++;
    const now = new Date();
    const notification: Notification = { 
      ...insertNotification, 
      id,
      read: false,
      createdAt: now
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;
    
    const updatedNotification = { ...notification, read: true };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }
}

export const storage = new MemStorage();
