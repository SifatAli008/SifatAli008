"use client";

import { Children, isValidElement, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogCloseButton,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DashboardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "md" | "lg" | "xl" | "2xl";
}

const sizeClasses = {
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
  "2xl": "max-w-4xl",
};

export function DashboardModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "lg",
}: DashboardModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(sizeClasses[size])}>
        <DialogCloseButton />
        <DialogHeader>
          <p className="label-mono text-[10px] text-accent">ADMIN</p>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5">
          {children}
        </div>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

function getSelectOptions(children: ReactNode) {
  const options: { value: string; label: string }[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child) || child.type !== "option") return;

    const { value, children: label } = child.props as {
      value?: string | number;
      children?: ReactNode;
    };

    options.push({
      value: String(value ?? ""),
      label: typeof label === "string" ? label : String(label ?? value ?? ""),
    });
  });

  return options;
}

export function DashboardSelect({
  className,
  children,
  value,
  onChange,
  disabled,
  name,
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const options = getSelectOptions(children);
  const selected = value !== undefined && value !== null ? String(value) : undefined;

  return (
    <Select
      value={selected}
      onValueChange={(next) => {
        onChange?.({
          target: { value: next, name },
          currentTarget: { value: next, name },
        } as React.ChangeEvent<HTMLSelectElement>);
      }}
      disabled={disabled}
      name={name}
    >
      <SelectTrigger className={cn("mt-2 w-full", className)}>
        <SelectValue placeholder="Select…" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function DashboardFormActions({
  onCancel,
  onSave,
  saveLabel = "Save",
  saving = false,
}: {
  onCancel: () => void;
  onSave: () => void;
  saveLabel?: string;
  saving?: boolean;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onCancel}
        className="border-2 border-white/10 px-5 py-2.5 text-sm text-zinc-400 transition-colors hover:border-white/20 hover:text-cream"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="border-2 border-accent bg-accent px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-cream transition-opacity hover:brightness-110 disabled:opacity-50"
      >
        {saving ? "Saving…" : saveLabel}
      </button>
    </>
  );
}
