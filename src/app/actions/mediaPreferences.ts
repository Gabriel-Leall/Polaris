"use server";

import { supabase } from "@/lib/supabase";
import { MediaPreference } from "@/types";
import {
  createMediaPreferenceSchema,
  updateMediaPreferenceSchema,
  userIdSchema,
  type CreateMediaPreferenceInput,
  type UpdateMediaPreferenceInput,
} from "@/lib/validations";

// Media Preferences Server Actions

export const createMediaPreference = async (
  data: CreateMediaPreferenceInput
): Promise<MediaPreference> => {
  try {
    const validatedData = createMediaPreferenceSchema.parse(data);

    const insertData = {
      user_id: validatedData.userId,
      source_type: validatedData.sourceType,
      source_url: validatedData.sourceUrl,
    };

    const { data: preference, error } = await supabase
      .from("media_preferences")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create media preference: ${error.message}`);
    }

    return {
      id: preference.id,
      userId: preference.user_id,
      sourceType: preference.source_type,
      sourceUrl: preference.source_url,
      createdAt: new Date(preference.created_at),
      updatedAt: new Date(preference.updated_at),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Create media preference failed: ${error.message}`);
    }
    throw new Error("Create media preference failed: Unknown error");
  }
};

export const updateMediaPreference = async (
  id: string,
  data: Partial<UpdateMediaPreferenceInput>
): Promise<MediaPreference> => {
  try {
    const validatedData = updateMediaPreferenceSchema.parse({ id, ...data });

    const updateData: Record<string, unknown> = {};
    if (validatedData.sourceType !== undefined)
      updateData.source_type = validatedData.sourceType;
    if (validatedData.sourceUrl !== undefined)
      updateData.source_url = validatedData.sourceUrl;

    updateData.updated_at = new Date().toISOString();

    const { data: preference, error } = await supabase
      .from("media_preferences")
      .update(updateData)
      .eq("id", validatedData.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update media preference: ${error.message}`);
    }

    return {
      id: preference.id,
      userId: preference.user_id,
      sourceType: preference.source_type,
      sourceUrl: preference.source_url,
      createdAt: new Date(preference.created_at),
      updatedAt: new Date(preference.updated_at),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Update media preference failed: ${error.message}`);
    }
    throw new Error("Update media preference failed: Unknown error");
  }
};

export const deleteMediaPreference = async (id: string): Promise<void> => {
  try {
    const validatedId = userIdSchema.parse(id);

    const { error } = await supabase
      .from("media_preferences")
      .delete()
      .eq("id", validatedId);

    if (error) {
      throw new Error(`Failed to delete media preference: ${error.message}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Delete media preference failed: ${error.message}`);
    }
    throw new Error("Delete media preference failed: Unknown error");
  }
};

export const getMediaPreference = async (
  userId: string
): Promise<MediaPreference | null> => {
  try {
    const validatedUserId = userIdSchema.parse(userId);

    const { data: preference, error } = await supabase
      .from("media_preferences")
      .select("*")
      .eq("user_id", validatedUserId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to fetch media preference: ${error.message}`);
    }

    return {
      id: preference.id,
      userId: preference.user_id,
      sourceType: preference.source_type,
      sourceUrl: preference.source_url,
      createdAt: new Date(preference.created_at),
      updatedAt: new Date(preference.updated_at),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Get media preference failed: ${error.message}`);
    }
    throw new Error("Get media preference failed: Unknown error");
  }
};

export const saveMediaPreference = async (
  userId: string,
  sourceType: "spotify" | "youtube",
  sourceUrl: string
): Promise<MediaPreference> => {
  try {
    const existingPreference = await getMediaPreference(userId);

    if (existingPreference) {
      return await updateMediaPreference(existingPreference.id, {
        sourceType,
        sourceUrl,
      });
    } else {
      return await createMediaPreference({
        userId,
        sourceType,
        sourceUrl,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Save media preference failed: ${error.message}`);
    }
    throw new Error("Save media preference failed: Unknown error");
  }
};
