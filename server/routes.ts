import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertIncidentSchema, 
  insertCommentSchema, 
  insertNotificationSchema,
  IncidentStatus,
  IncidentPriority,
  IncidentType
} from "@shared/schema";

// Middleware to check if user is authenticated
const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Middleware to check if user is admin
const isAdmin = (req: any, res: any, next: any) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Forbidden" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Incidents endpoints
  app.get("/api/incidents", isAuthenticated, async (req, res) => {
    try {
      const incidents = await storage.getIncidents();
      res.json(incidents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch incidents" });
    }
  });

  app.get("/api/incidents/:id", isAuthenticated, async (req, res) => {
    try {
      const incident = await storage.getIncident(parseInt(req.params.id));
      if (!incident) {
        return res.status(404).json({ message: "Incident not found" });
      }
      res.json(incident);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch incident" });
    }
  });

  app.post("/api/incidents", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertIncidentSchema.parse({
        ...req.body,
        reportedBy: req.user.id
      });
      
      const incident = await storage.createIncident(validatedData);
      
      // Create notification for admin users
      const adminUsers = Array.from((await storage.getIncidents()).values())
        .filter(user => user.role === "admin");
        
      adminUsers.forEach(async (admin) => {
        await storage.createNotification({
          userId: admin.id,
          title: "New Incident Reported",
          message: `A new incident "${incident.title}" has been reported and requires attention.`
        });
      });
      
      res.status(201).json(incident);
    } catch (error) {
      res.status(400).json({ message: "Invalid incident data", error });
    }
  });

  app.put("/api/incidents/:id", isAuthenticated, async (req, res) => {
    try {
      const incidentId = parseInt(req.params.id);
      const existingIncident = await storage.getIncident(incidentId);
      
      if (!existingIncident) {
        return res.status(404).json({ message: "Incident not found" });
      }
      
      // Only allow admins or the reporter to update
      if (req.user.role !== "admin" && existingIncident.reportedBy !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to update this incident" });
      }
      
      const updatedIncident = await storage.updateIncident(incidentId, req.body);
      
      // Create notification for the reporter if status was changed
      if (req.body.status && req.body.status !== existingIncident.status) {
        await storage.createNotification({
          userId: existingIncident.reportedBy,
          title: "Incident Status Updated",
          message: `Your incident "${existingIncident.title}" status has been updated to ${req.body.status}.`
        });
      }
      
      res.json(updatedIncident);
    } catch (error) {
      res.status(400).json({ message: "Failed to update incident", error });
    }
  });

  app.delete("/api/incidents/:id", isAdmin, async (req, res) => {
    try {
      const incidentId = parseInt(req.params.id);
      const success = await storage.deleteIncident(incidentId);
      
      if (!success) {
        return res.status(404).json({ message: "Incident not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete incident" });
    }
  });

  // Comments endpoints
  app.get("/api/incidents/:id/comments", isAuthenticated, async (req, res) => {
    try {
      const incidentId = parseInt(req.params.id);
      const comments = await storage.getCommentsByIncident(incidentId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/incidents/:id/comments", isAuthenticated, async (req, res) => {
    try {
      const incidentId = parseInt(req.params.id);
      const incident = await storage.getIncident(incidentId);
      
      if (!incident) {
        return res.status(404).json({ message: "Incident not found" });
      }
      
      const validatedData = insertCommentSchema.parse({
        ...req.body,
        incidentId,
        userId: req.user.id
      });
      
      const comment = await storage.createComment(validatedData);
      
      // Notify incident reporter if someone else commented
      if (incident.reportedBy !== req.user.id) {
        await storage.createNotification({
          userId: incident.reportedBy,
          title: "New Comment on Your Incident",
          message: `A new comment has been added to your incident "${incident.title}".`
        });
      }
      
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ message: "Invalid comment data", error });
    }
  });

  // Notifications endpoints
  app.get("/api/notifications", isAuthenticated, async (req, res) => {
    try {
      const notifications = await storage.getNotificationsByUser(req.user.id);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.put("/api/notifications/:id/read", isAuthenticated, async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const notification = await storage.markNotificationAsRead(notificationId);
      
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Stats endpoints
  app.get("/api/stats", isAuthenticated, async (req, res) => {
    try {
      const incidents = await storage.getIncidents();
      
      const total = incidents.length;
      const pending = incidents.filter(i => i.status === "pending").length;
      const inProgress = incidents.filter(i => i.status === "in_progress").length;
      const resolved = incidents.filter(i => i.status === "resolved").length;
      const urgent = incidents.filter(i => i.priority === "critical").length;
      
      // Calculate incident types distribution
      const typeDistribution = incidents.reduce((acc, incident) => {
        acc[incident.type] = (acc[incident.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Calculate trend data (last 4 weeks)
      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
      
      const weeklyData = [0, 0, 0, 0]; // 4 weeks
      const resolvedWeeklyData = [0, 0, 0, 0]; // 4 weeks
      
      incidents.forEach(incident => {
        const createdDate = new Date(incident.createdAt);
        if (createdDate >= fourWeeksAgo) {
          const weekIndex = Math.floor((Date.now() - createdDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
          if (weekIndex >= 0 && weekIndex < 4) {
            weeklyData[3 - weekIndex]++;
            
            if (incident.status === "resolved") {
              resolvedWeeklyData[3 - weekIndex]++;
            }
          }
        }
      });
      
      res.json({
        overview: {
          total,
          pending,
          inProgress,
          resolved,
          urgent
        },
        typeDistribution,
        trends: {
          weeks: ["Week 1", "Week 2", "Week 3", "Week 4"],
          newIncidents: weeklyData,
          resolvedIncidents: resolvedWeeklyData
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
