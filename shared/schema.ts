import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("user"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
  role: true,
});

// Incident model
export const incidents = pgTable("incidents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  reportedBy: integer("reported_by").notNull(),
  assignedTo: integer("assigned_to"),
  status: text("status").notNull().default("pending"),
  priority: text("priority").notNull(),
  type: text("type").notNull(),
  location: text("location"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  evidence: text("evidence"),
});

export const insertIncidentSchema = createInsertSchema(incidents).pick({
  title: true,
  description: true,
  reportedBy: true,
  assignedTo: true,
  status: true,
  priority: true,
  type: true,
  location: true,
  evidence: true,
});

// Comment model
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  incidentId: integer("incident_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCommentSchema = createInsertSchema(comments).pick({
  incidentId: true,
  userId: true,
  content: true,
});

// Notification model
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  title: true,
  message: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Incident = typeof incidents.$inferSelect;
export type InsertIncident = z.infer<typeof insertIncidentSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

// Enums for validation
export const IncidentStatus = z.enum(["pending", "in_progress", "resolved", "closed", "reopened"]);
export const IncidentPriority = z.enum(["low", "medium", "high", "critical"]);
export const IncidentType = z.enum(["hardware", "software", "network", "security", "service", "other"]);
export const UserRole = z.enum(["admin", "employee", "user"]);
