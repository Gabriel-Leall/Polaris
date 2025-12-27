"use server";

import { supabase } from "@/lib/supabase";
import { QuickLink } from "@/types";
import {
  createQuickLinkSchema,
  updateQuickLinkSchema,
  userIdSchema,
  type CreateQuickLinkInput,
  type UpdateQuickLinkInput,
} from "@/lib/validations";

// Quick Links Server Actions

export const createQuickLink = async (
  data: CreateQuickLinkInput
): Promise<QuickLink> => {
  try {
    const validatedData = createQuickLinkSchema.parse(data);

    const insertData = {
      user_id: validatedData.userId,
      url: validatedData.url,
      title: validatedData.title,
      favicon_url: validatedData.faviconUrl ?? null,
      position: validatedData.position ?? 0,
    };

    const { data: link, error } = await supabase
      .from("quick_links")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create quick link: ${error.message}`);
    }

    return {
      id: link.id,
      userId: link.user_id,
      url: link.url,
      title: link.title,
      faviconUrl: link.favicon_url,
      position: link.position,
      createdAt: new Date(link.created_at),
      updatedAt: new Date(link.updated_at),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Create quick link failed: ${error.message}`);
    }
    throw new Error("Create quick link failed: Unknown error");
  }
};

export const updateQuickLink = async (
  id: string,
  data: Partial<UpdateQuickLinkInput>
): Promise<QuickLink> => {
  try {
    const validatedData = updateQuickLinkSchema.parse({ id, ...data });

    const updateData: Record<string, unknown> = {};
    if (validatedData.url !== undefined) updateData.url = validatedData.url;
    if (validatedData.title !== undefined) updateData.title = validatedData.title;
    if (validatedData.faviconUrl !== undefined) updateData.favicon_url = validatedData.faviconUrl;
    if (validatedData.position !== undefined) updateData.position = validatedData.position;

    updateData.updated_at = new Date().toISOString();

    const { data: link, error } = await supabase
      .from("quick_links")
      .update(updateData)
      .eq("id", validatedData.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update quick link: ${error.message}`);
    }

    return {
      id: link.id,
      userId: link.user_id,
      url: link.url,
      title: link.title,
      faviconUrl: link.favicon_url,
      position: link.position,
      createdAt: new Date(link.created_at),
      updatedAt: new Date(link.updated_at),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Update quick link failed: ${error.message}`);
    }
    throw new Error("Update quick link failed: Unknown error");
  }
};

export const deleteQuickLink = async (id: string): Promise<void> => {
  try {
    const validatedId = userIdSchema.parse(id);

    const { error } = await supabase
      .from("quick_links")
      .delete()
      .eq("id", validatedId);

    if (error) {
      throw new Error(`Failed to delete quick link: ${error.message}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Delete quick link failed: ${error.message}`);
    }
    throw new Error("Delete quick link failed: Unknown error");
  }
};

export const getQuickLinks = async (userId: string): Promise<QuickLink[]> => {
  try {
    const validatedUserId = userIdSchema.parse(userId);

    const { data: links, error } = await supabase
      .from("quick_links")
      .select("*")
      .eq("user_id", validatedUserId)
      .order("position", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch quick links: ${error.message}`);
    }

    return (links || []).map((link) => ({
      id: link.id,
      userId: link.user_id,
      url: link.url,
      title: link.title,
      faviconUrl: link.favicon_url,
      position: link.position,
      createdAt: new Date(link.created_at),
      updatedAt: new Date(link.updated_at),
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Get quick links failed: ${error.message}`);
    }
    throw new Error("Get quick links failed: Unknown error");
  }
};

export const getQuickLink = async (id: string): Promise<QuickLink | null> => {
  try {
    const validatedId = userIdSchema.parse(id);

    const { data: link, error } = await supabase
      .from("quick_links")
      .select("*")
      .eq("id", validatedId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to fetch quick link: ${error.message}`);
    }

    return {
      id: link.id,
      userId: link.user_id,
      url: link.url,
      title: link.title,
      faviconUrl: link.favicon_url,
      position: link.position,
      createdAt: new Date(link.created_at),
      updatedAt: new Date(link.updated_at),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Get quick link failed: ${error.message}`);
    }
    throw new Error("Get quick link failed: Unknown error");
  }
};
