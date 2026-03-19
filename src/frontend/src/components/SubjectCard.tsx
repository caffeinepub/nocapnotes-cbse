import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  Languages,
  Monitor,
} from "lucide-react";
import type { Subject } from "../backend";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  calculator: Calculator,
  flask: FlaskConical,
  book: BookOpen,
  globe: Globe,
  languages: Languages,
  monitor: Monitor,
};

function getIconComponent(iconName: string) {
  const key = iconName.toLowerCase();
  for (const k of Object.keys(ICON_MAP)) {
    if (key.includes(k)) return ICON_MAP[k];
  }
  return BookOpen;
}

interface SubjectCardProps {
  subject: Subject;
  index: number;
}

export default function SubjectCard({ subject, index }: SubjectCardProps) {
  const Icon = getIconComponent(subject.icon);
  const color = subject.color || "#2F80ED";

  return (
    <div
      className="bg-white rounded-xl shadow-card border border-border overflow-hidden hover:shadow-card-hover transition-shadow group"
      data-ocid={`subject.item.${index}`}
    >
      <div
        className="h-20 flex items-center justify-center"
        style={{ backgroundColor: color }}
      >
        <Icon className="w-8 h-8 text-white" />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-base text-foreground mb-1">
          {subject.name}
        </h3>
        <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
          {subject.description}
        </p>
        <Button
          asChild
          size="sm"
          className="w-full rounded-lg text-xs font-semibold text-white"
          style={{ backgroundColor: color }}
          data-ocid={`subject.view_button.${index}`}
        >
          <Link to="/subjects/$id" params={{ id: subject.id.toString() }}>
            View Notes
          </Link>
        </Button>
      </div>
    </div>
  );
}
