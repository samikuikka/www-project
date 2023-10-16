import type { Annotation, Post } from "@prisma/client";

export type PostWithAnnotations = Post & {
  annotations: Annotation[];
};

export type AnnotationWithType = Annotation & {
  type: "annotation";
};

export type AnnotationSelection = {
  type: "selection";
  start: number;
  end: number;
};

export type AnnotationType = AnnotationWithType | AnnotationSelection;
