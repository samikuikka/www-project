import type { Annotation, Post } from "@prisma/client";

export type PostWithAnnotations = Post & {
  annotations: Annotation[];
};
