import Image from "next/image";
import { ImagePlaceholder } from "@/ui/image-placeholder";
import type { LandingContent } from "../schemas/landing-content.schema";

type Project = LandingContent["projects"]["residential"][number];

export interface ProjectCardProps {
  project: Project;
  categoryLabel: string;
}

export function ProjectCard({ project, categoryLabel }: ProjectCardProps) {
  const { image, imageLabel, capacity, location, quote, author, description } = project;
  return (
    <article className="flex flex-col overflow-hidden rounded-card border border-gray-200 bg-white shadow-card">
      <div className="relative aspect-[4/3]">
        {image ? (
          <Image src={image} alt={`${location} solar installation`} fill sizes="(min-width: 960px) 380px, 100vw" className="object-cover" />
        ) : (
          <ImagePlaceholder label={imageLabel} />
        )}
      </div>
      <div className="flex flex-col gap-2.5 p-5">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-brand-50 px-2.5 py-[3px] text-xs font-semibold text-brand-600">{categoryLabel}</span>
          <span className="rounded-full bg-gray-100 px-2.5 py-[3px] text-xs font-semibold text-gray-700">{capacity}</span>
        </div>
        <h3 className="text-[17px] font-semibold">{location}</h3>
        {quote ? (
          <>
            <p className="text-sm leading-[1.6] text-gray-700 italic">&quot;{quote}&quot;</p>
            <span className="text-[13px] text-gray-500">{author}</span>
          </>
        ) : (
          <p className="text-sm leading-[1.6] text-gray-500">{description}</p>
        )}
      </div>
    </article>
  );
}
