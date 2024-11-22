import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: "to-do" | "in-progress" | "done";
  dueDate: Date;
  userId: Types.ObjectId; // Alterado de string para Types.ObjectId
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["to-do", "in-progress", "done"], default: "to-do" },
    dueDate: { type: Date, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Sem alteração
  },
  {
    timestamps: true,
  }
);

export const Task = mongoose.model<ITask>("Task", taskSchema);
