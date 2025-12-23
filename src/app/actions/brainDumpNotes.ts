"use server";

import { supabase } from "@/lib/supabase";
import { BrainDumpNote } from "@/types";
import {
  createBrainDumpNoteSchema,
  updateBrainDumpNoteSchema,
  userIdSchema,
  type CreateBrainDumpNoteInput,
  type UpdateBrainDumpNoteInput,
} from "@/lib/validations";

// Brain Dump Notes Server Actions
export const createBrainDumpNote = async (
  data: CreateBrainDumpNoteInput
): Promise<BrainDumpNote> => {
  try {
    // Validate input data
    const validatedData = createBrainDumpNoteSchema.parse(data);

    const insertData = {
      user_id: validatedData.userId,
      content: validatedData.content,
      version: validatedData.version,
    };

    const { data: note, error } = await supabase
      .from("brain_dump_notes")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create brain dump note: ${error.message}`);
    }

    // Transform database row to BrainDumpNote
    return {
      id: note.id,
      userId: note.user_id,
      content: note.content,
      version: note.version,
      createdAt: new Date(note.created_at),
      updatedAt: new Date(note.updated_at),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Create brain dump note failed: ${error.message}`);
    }
    throw new Error("Create brain dump note failed: Unknown error");
  }
};

export const updateBrainDumpNote = async (
  id: string,
  data: Partial<UpdateBrainDumpNoteInput>
): Promise<BrainDumpNote> => {
  try {
    // Validate input data
    const validatedData = updateBrainDumpNoteSchema.parse({ id, ...data });

    const updateData: Record<string, any> = {};
    if (validatedData.content !== undefined)
      updateData.content = validatedData.content;
    if (validatedData.version !== undefined)
      updateData.version = validatedData.version;

    // Always update the updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    const { data: note, error } = await supabase
      .from("brain_dump_notes")
      .update(updateData)
      .eq("id", validatedData.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update brain dump note: ${error.message}`);
    }

    // Transform database row to BrainDumpNote
    return {
      id: note.id,
      userId: note.user_id,
      content: note.content,
      version: note.version,
      createdAt: new Date(note.created_at),
      updatedAt: new Date(note.updated_at),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Update brain dump note failed: ${error.message}`);
    }
    throw new Error("Update brain dump note failed: Unknown error");
  }
};

export const deleteBrainDumpNote = async (id: string): Promise<void> => {
  try {
    // Validate note ID
    const validatedId = userIdSchema.parse(id);

    const { error } = await supabase
      .from("brain_dump_notes")
      .delete()
      .eq("id", validatedId);

    if (error) {
      throw new Error(`Failed to delete brain dump note: ${error.message}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Delete brain dump note failed: ${error.message}`);
    }
    throw new Error("Delete brain dump note failed: Unknown error");
  }
};

export const getBrainDumpNote = async (
  userId: string
): Promise<BrainDumpNote | null> => {
  try {
    // Validate user ID
    const validatedUserId = userIdSchema.parse(userId);

    const { data: note, error } = await supabase
      .from("brain_dump_notes")
      .select("*")
      .eq("user_id", validatedUserId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // If no note exists, return null instead of throwing error
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to fetch brain dump note: ${error.message}`);
    }

    // Transform database row to BrainDumpNote
    return {
      id: note.id,
      userId: note.user_id,
      content: note.content,
      version: note.version,
      createdAt: new Date(note.created_at),
      updatedAt: new Date(note.updated_at),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Get brain dump note failed: ${error.message}`);
    }
    throw new Error("Get brain dump note failed: Unknown error");
  }
};

export const saveBrainDumpNote = async (
  userId: string,
  content: string
): Promise<BrainDumpNote> => {
  try {
    // First, try to get existing note
    const existingNote = await getBrainDumpNote(userId);

    if (existingNote) {
      // Update existing note with incremented version
      return await updateBrainDumpNote(existingNote.id, {
        content,
        version: existingNote.version + 1,
      });
    } else {
      // Create new note
      return await createBrainDumpNote({
        userId,
        content,
        version: 1,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Save brain dump note failed: ${error.message}`);
    }
    throw new Error("Save brain dump note failed: Unknown error");
  }
};
