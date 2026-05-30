"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { ContactSubmission } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import {
  DashboardFormActions,
  DashboardModal,
} from "@/components/dashboard/dashboard-modal";
import { Mail, Trash2, Check, Eye, Pencil } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ContactsManagerPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    getDocs(query(collection(db, "contacts"), orderBy("createdAt", "desc")))
      .then((snap) => {
        setContacts(
          snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContactSubmission))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (contact: ContactSubmission, read = true) => {
    if (!db) return;
    await updateDoc(doc(db, "contacts", contact.id), { read });
    setContacts((prev) =>
      prev.map((c) => (c.id === contact.id ? { ...c, read } : c))
    );
    if (editing?.id === contact.id) {
      setEditing({ ...contact, read });
    }
    toast.success(read ? "Marked as read" : "Marked as unread");
  };

  const save = async () => {
    if (!editing || !db) return;
    if (!editing.name.trim() || !editing.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    const payload = {
      name: editing.name.trim(),
      email: editing.email.trim(),
      subject: editing.subject.trim(),
      message: editing.message.trim(),
      read: editing.read,
    };

    await updateDoc(doc(db, "contacts", editing.id), payload);
    setContacts((prev) =>
      prev.map((c) => (c.id === editing.id ? { ...c, ...payload } : c))
    );
    setEditing(null);
    toast.success("Contact updated");
  };

  const remove = async (id: string) => {
    if (!db) return;
    await deleteDoc(doc(db, "contacts", id));
    setContacts((prev) => prev.filter((c) => c.id !== id));
    if (editing?.id === id) setEditing(null);
    toast.success("Deleted");
  };

  const unread = contacts.filter((c) => !c.read).length;

  return (
    <div>
      <div className="flex items-start gap-3">
        <Mail className="mt-1 h-6 w-6 shrink-0 text-accent" />
        <DashboardPageHeader
          label="INBOX"
          title="Contacts"
          description={
            unread > 0
              ? `Inquiries from the site contact form · ${unread} unread`
              : "Inquiries from the site contact form"
          }
        />
      </div>

      {loading ? (
        <p className="mt-10 text-sm text-zinc-500">Loading…</p>
      ) : contacts.length === 0 ? (
        <div className="dashboard-empty mt-10 text-sm text-zinc-500">
          No contact submissions yet.
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {contacts.map((contact) => (
            <li
              key={contact.id}
              className={`glass glow-border cursor-pointer rounded-xl p-5 transition-colors ${
                !contact.read ? "ring-1 ring-accent/40" : ""
              }`}
              onClick={() => setEditing(contact)}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-cream">{contact.name}</p>
                    {!contact.read && <Badge variant="success">New</Badge>}
                  </div>
                  <p className="mt-1 truncate text-sm text-zinc-500">{contact.subject}</p>
                  <p className="mt-1 text-xs text-zinc-600">
                    {formatDate(contact.createdAt)}
                  </p>
                </div>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="View / edit"
                    onClick={() => setEditing(contact)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  {!contact.read && (
                    <Button
                      variant="outline"
                      size="icon"
                      title="Mark read"
                      onClick={() => markRead(contact)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(contact.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <DashboardModal
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        title="Contact inquiry"
        description={
          editing
            ? `Received ${formatDate(editing.createdAt)}`
            : undefined
        }
        size="lg"
        footer={
          editing && (
            <>
              <button
                type="button"
                onClick={() => remove(editing.id)}
                className="mr-auto border-2 border-red-500/30 px-4 py-2.5 text-sm text-red-400 transition-colors hover:border-red-500/60"
              >
                Delete
              </button>
              <DashboardFormActions
                onCancel={() => setEditing(null)}
                onSave={save}
                saveLabel="Save changes"
              />
            </>
          )
        }
      >
        {editing && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Name</Label>
                <Input
                  className="dashboard-field mt-2"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  className="dashboard-field mt-2"
                  type="email"
                  value={editing.email}
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Subject</Label>
              <Input
                className="dashboard-field mt-2"
                value={editing.subject}
                onChange={(e) => setEditing({ ...editing, subject: e.target.value })}
              />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                className="dashboard-field mt-2"
                rows={6}
                value={editing.message}
                onChange={(e) => setEditing({ ...editing, message: e.target.value })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-zinc-400">
              <input
                type="checkbox"
                checked={editing.read}
                onChange={(e) => setEditing({ ...editing, read: e.target.checked })}
              />
              Mark as read
            </label>
            <a
              href={`mailto:${editing.email}?subject=Re: ${encodeURIComponent(editing.subject)}`}
              className="label-mono inline-flex items-center gap-2 text-xs text-accent hover:underline"
            >
              <Eye className="h-3.5 w-3.5" />
              Reply via email
            </a>
          </div>
        )}
      </DashboardModal>

      {!db && (
        <p className="mt-4 text-xs text-amber-500/80">
          Firebase not configured — contact form submissions will not appear here.
        </p>
      )}
    </div>
  );
}
