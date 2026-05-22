"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MessageSquare, Send, User } from "lucide-react";
import { toast } from "sonner";
import { BrutalButton } from "@/components/ui/brutal-button";
import { submitContact } from "@/lib/firebase/queries";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const brutalSchema = z.object({
  email: z.string().email("Valid email required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;
type BrutalFormData = z.infer<typeof brutalSchema>;

interface ContactFormProps {
  variant?: "default" | "brutal";
}

export function ContactForm({ variant = "default" }: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const isBrutal = variant === "brutal";

  const defaultForm = useForm<FormData>({ resolver: zodResolver(schema) });
  const brutalForm = useForm<BrutalFormData>({
    resolver: zodResolver(brutalSchema),
  });

  const onSubmitDefault = async (data: FormData) => {
    setLoading(true);
    const result = await submitContact(data);
    setLoading(false);
    if (result.success) {
      toast.success("Message sent.");
      defaultForm.reset();
    } else {
      toast.error(result.error ?? "Failed to send");
    }
  };

  const onSubmitBrutal = async (data: BrutalFormData) => {
    setLoading(true);
    const result = await submitContact({
      name: "Website",
      email: data.email,
      subject: "Contact",
      message: data.message,
    });
    setLoading(false);
    if (result.success) {
      toast.success("Message sent.");
      brutalForm.reset();
    } else {
      toast.error(result.error ?? "Failed to send");
    }
  };

  if (isBrutal) {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = brutalForm;

    return (
      <form onSubmit={handleSubmit(onSubmitBrutal)} className="space-y-8">
        <div>
          <label className="label-mono mb-2 flex items-center gap-2 text-ink">
            <Mail className="h-3.5 w-3.5" /> EMAIL
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@email.com"
            className="field-brutal"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 font-mono text-xs text-ink">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="label-mono mb-2 flex items-center gap-2 text-ink">
            <MessageSquare className="h-3.5 w-3.5" /> MESSAGE
          </label>
          <textarea
            id="message"
            rows={4}
            placeholder="Your message…"
            className="field-brutal resize-none"
            {...register("message")}
          />
          {errors.message && (
            <p className="mt-1 font-mono text-xs text-ink">
              {errors.message.message}
            </p>
          )}
        </div>
        <BrutalButton
          type="submit"
          variant="primary"
          icon={Send}
          disabled={loading}
          className="!h-[52px] w-full !text-base"
        >
          {loading ? "SENDING…" : "SEND"}
        </BrutalButton>
      </form>
    );
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = defaultForm;

  return (
    <form onSubmit={handleSubmit(onSubmitDefault)} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="label-mono flex items-center gap-2 text-muted" htmlFor="name">
            <User className="h-3.5 w-3.5" /> NAME
          </label>
          <input id="name" className="field-brutal mt-2" {...register("name")} />
          {errors.name && (
            <p className="mt-1 font-mono text-xs text-accent">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="label-mono text-muted" htmlFor="email-d">
            EMAIL
          </label>
          <input
            id="email-d"
            type="email"
            className="field-brutal mt-2"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 font-mono text-xs text-accent">{errors.email.message}</p>
          )}
        </div>
      </div>
      <div>
        <label className="label-mono text-muted" htmlFor="subject">
          SUBJECT
        </label>
        <input id="subject" className="field-brutal mt-2" {...register("subject")} />
        {errors.subject && (
          <p className="mt-1 font-mono text-xs text-accent">{errors.subject.message}</p>
        )}
      </div>
      <div>
        <label className="label-mono text-muted" htmlFor="message-d">
          MESSAGE
        </label>
        <textarea
          id="message-d"
          rows={6}
          className="field-brutal mt-2 resize-none"
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
        iconPosition="left"
        disabled={loading}
      >
        {loading ? "SENDING…" : "SEND MESSAGE"}
      </BrutalButton>
    </form>
  );
}
