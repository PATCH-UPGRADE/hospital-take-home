"use client";

import { AlertTriangleIcon, Loader2Icon, SearchIcon } from "lucide-react";
import { headerClass, mainPadding } from "@/config/constants";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

type EntityHeaderProps = {
  title: string;
  description?: string;
  /** Rendered on the right of the header, e.g. a "New" button. */
  actions?: React.ReactNode;
  className?: string;
};

export const EntityHeader = ({
  title,
  description,
  actions,
  className,
}: EntityHeaderProps) => {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-between gap-x-4",
        className,
      )}
    >
      <div className="flex flex-col">
        <h1 className={headerClass}>{title}</h1>
        {description && (
          <p className="text-xs md:text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-x-2">{actions}</div>}
    </div>
  );
};

type EntityContainerProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
};

export const EntityContainer = ({
  children,
  header,
  className,
}: EntityContainerProps) => {
  return (
    <div className={cn(mainPadding, className)}>
      <div className="mx-auto max-w-screen-xl w-full flex flex-col gap-y-8 h-full">
        {header}
        <div className="flex flex-col gap-y-4 h-full">{children}</div>
      </div>
    </div>
  );
};

interface EntitySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const EntitySearch = ({
  value,
  onChange,
  placeholder = "Search",
}: EntitySearchProps) => {
  return (
    <div className="relative w-full">
      <SearchIcon className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="bg-background shadow-none border-border pl-8"
        placeholder={placeholder}
        aria-label={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

interface StateViewProps {
  message?: string;
}

export const LoadingView = ({ message }: StateViewProps) => {
  return (
    <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
      <Loader2Icon className="size-6 animate-spin text-primary" />
      {!!message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};

export const ErrorView = ({ message }: StateViewProps) => {
  return (
    <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
      <AlertTriangleIcon className="size-6 text-primary" />
      {!!message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};
