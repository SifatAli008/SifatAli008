"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, ChevronDown, Send } from "lucide-react";
import { toast } from "sonner";
import { BrutalButton } from "@/components/ui/brutal-button";
import { submitContact } from "@/lib/firebase/queries";
import type { BookingSlot } from "@/components/site/booking-calendar";

const SERVICES = [
  "Web Development",
  "AI / RAG Systems",
  "Full-Stack Product",
  "EdTech & Mentorship",
  "Mobile Application",
  "Consulting / Workshop",
  "Other",
] as const;

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  service: z.string().min(1, "Select a service"),
  location: z.string().min(2, "Location is required"),
  budget: z.string().min(1, "Budget is required"),
  message: z.string().min(150, "Tell us at least 150 characters about the project"),
});

type FormData = z.infer<typeof schema>;

interface ProjectInquiryFormProps {
  selectedSlot: BookingSlot;
  onChangeTimeSlot?: () => void;
}

export function ProjectInquiryForm({
  selectedSlot,
  onChangeTimeSlot,
}: ProjectInquiryFormProps) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { budget: "" },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const body = [
      `Preferred call: ${selectedSlot.label}`,
      `Service: ${data.service}`,
      `Location: ${data.location}`,
      `Budget (USD): ${data.budget}`,
      "",
      data.message,
    ].join("\n");

    const result = await submitContact({
      name: data.name,
      email: data.email,
      subject: `Project inquiry — ${data.service}`,
      message: body,
    });
    setLoading(false);

    if (result.success) {
      toast.success("Project details sent.");
      reset();
    } else {
      toast.error(result.error ?? "Failed to send");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div
        className="flex items-center gap-3 border-2 border-ink bg-cream p-3"
        style={{ boxShadow: "4px 4px 0 0 #0a0a0a" }}
      >
        <span className="icon-3d-box flex h-10 w-10 shrink-0 items-center justify-center border-2 border-ink bg-accent">
          <Calendar className="h-5 w-5 text-ink" strokeWidth={2.5} />
        </span>
        <div className="min-w-0 flex-1">
          {onChangeTimeSlot && (
            <button
              type="button"
              onClick={onChangeTimeSlot}
              className="label-mono text-accent hover:underline"
            >
              CHANGE TIME SLOT
            </button>
          )}
          <p className="truncate font-mono text-sm font-bold text-ink">
            {selectedSlot.label}
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="label-mono mb-2 block text-ink" htmlFor="inq-name">
            NAME <span className="text-accent">*</span>
          </label>
          <input
            id="inq-name"
            placeholder="Your full name"
            className="field-brutal-box"
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 font-mono text-xs text-accent">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="label-mono mb-2 block text-ink" htmlFor="inq-email">
            EMAIL <span className="text-accent">*</span>
          </label>
          <input
            id="inq-email"
            type="email"
            placeholder="name@company.com"
            className="field-brutal-box"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 font-mono text-xs text-accent">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="label-mono mb-2 block text-ink" htmlFor="inq-service">
          SERVICE <span className="text-accent">*</span>
        </label>
        <div className="relative">
          <select
            id="inq-service"
            className="field-brutal-box appearance-none pr-10"
            defaultValue=""
            {...register("service")}
          >
            <option value="" disabled>
              Select a service…
            </option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        </div>
        {errors.service && (
          <p className="mt-1 font-mono text-xs text-accent">{errors.service.message}</p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="label-mono mb-2 block text-ink" htmlFor="inq-location">
            LOCATION <span className="text-accent">*</span>
          </label>
          <input
            id="inq-location"
            placeholder="City, Country"
            className="field-brutal-box"
            {...register("location")}
          />
          {errors.location && (
            <p className="mt-1 font-mono text-xs text-accent">{errors.location.message}</p>
          )}
        </div>
        <div>
          <label className="label-mono mb-2 block text-ink" htmlFor="inq-budget">
            BUDGET (USD) <span className="text-accent">*</span>
          </label>
          <input
            id="inq-budget"
            placeholder="9000"
            className="field-brutal-box"
            {...register("budget")}
          />
          {errors.budget && (
            <p className="mt-1 font-mono text-xs text-accent">{errors.budget.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="label-mono mb-2 block text-ink" htmlFor="inq-message">
          ABOUT THE PROJECT <span className="text-accent">*</span>
        </label>
        <textarea
          id="inq-message"
          rows={5}
          placeholder="Tell me at least 150 characters about the project…"
          className="field-brutal-box resize-none"
          {...register("message")}
        />
        {errors.message && (
          <p className="mt-1 font-mono text-xs text-accent">{errors.message.message}</p>
        )}
      </div>

      <BrutalButton
        type="submit"
        variant="primary"
        icon={Send}
        disabled={loading}
        className="!h-[52px] w-full !text-base"
      >
        {loading ? "SENDING…" : "SEND PROJECT DETAILS"}
      </BrutalButton>
    </form>
  );
}
