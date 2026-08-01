import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Privacy Policy - Sifat Ali",
    description:
      "How sifatali.site collects, uses, and protects personal data from contact forms, project inquiries, and the AI chat assistant.",
    path: "/privacy",
  }),
  title: { absolute: "Privacy Policy | Sifat Ali" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal / 01"
      title="Privacy Policy"
      updated="2 August 2026"
      intro="This policy explains what personal information is collected on sifatali.site (the “Site”), how it is used, and the choices you have. The Site is operated by Sifat Ali (“I”, “me”, “my”)."
      sections={[
        {
          title: "Who this applies to",
          body: (
            <>
              <p>
                Visitors, people who submit contact or project inquiry forms,
                people who use the on-site AI chat, and authenticated admin
                users of the dashboard.
              </p>
            </>
          ),
        },
        {
          title: "Information I collect",
          body: (
            <>
              <p>
                <strong>Information you provide:</strong>
              </p>
              <ul>
                <li>
                  Contact and project forms: name, email, subject, and message
                  content.
                </li>
                <li>
                  AI chat: the messages you send in the conversation (processed
                  to generate a reply).
                </li>
                <li>
                  Admin sign-in: email and authentication session data via
                  Firebase Authentication (admin area only).
                </li>
              </ul>
              <p className="pt-2">
                <strong>Information collected automatically:</strong>
              </p>
              <ul>
                <li>
                  Standard technical data such as IP address, browser type, and
                  request metadata when you load pages or call Site APIs
                  (server/hosting logs).
                </li>
                <li>
                  Optional local preferences (for example chat sound settings)
                  stored in your browser via{" "}
                  <code className="font-mono text-sm">localStorage</code>.
                </li>
                <li>
                  A session cookie used only for authenticated dashboard access
                  when an admin is signed in.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "How information is used",
          body: (
            <ul>
              <li>Respond to inquiries and project requests.</li>
              <li>Operate and improve the Site and AI chat assistant.</li>
              <li>Secure the admin dashboard and prevent abuse.</li>
              <li>Maintain basic operational logs and reliability.</li>
            </ul>
          ),
        },
        {
          title: "Legal bases (where applicable)",
          body: (
            <p>
              Where GDPR or similar laws apply, processing is based on{" "}
              <strong>legitimate interests</strong> (running a portfolio and
              responding to business inquiries),{" "}
              <strong>contract / pre-contract steps</strong> when you ask for
              work, and <strong>consent</strong> where you voluntarily submit
              form or chat content. Admin auth processing is necessary to
              secure the dashboard.
            </p>
          ),
        },
        {
          title: "Processors and third parties",
          body: (
            <>
              <p>Depending on configuration, data may be processed by:</p>
              <ul>
                <li>
                  <strong>Google Firebase / Firestore</strong> — hosting contact
                  submissions and auth for the admin dashboard.
                </li>
                <li>
                  <strong>Hosting / edge providers</strong> (for example Vercel
                  or equivalent) — delivering the Site and API routes.
                </li>
                <li>
                  <strong>AI model providers</strong> used by the chat API — to
                  generate replies from your chat messages. Do not paste secrets,
                  passwords, or sensitive personal data into chat.
                </li>
                <li>
                  <strong>Cloudinary</strong> (if enabled) — media assets for the
                  Site; not used as a contact inbox.
                </li>
              </ul>
              <p>
                These providers process data under their own terms and security
                controls. I do not sell personal information.
              </p>
            </>
          ),
        },
        {
          title: "Cookies and similar tech",
          body: (
            <p>
              The public marketing Site does not rely on advertising cookies.
              Authenticated admin sessions use a short-lived session cookie (
              <code className="font-mono text-sm">firebase-auth-session</code>
              ). Browser storage may keep non-essential UI preferences locally
              on your device.
            </p>
          ),
        },
        {
          title: "Retention",
          body: (
            <ul>
              <li>
                Contact / inquiry messages are kept as long as needed to respond
                and manage potential projects, then deleted or archived on
                request when no longer needed.
              </li>
              <li>
                Chat messages are processed to answer you; they are not published
                as blog content.
              </li>
              <li>
                Server logs are retained for a limited operational period
                consistent with security and debugging needs.
              </li>
            </ul>
          ),
        },
        {
          title: "Your rights",
          body: (
            <>
              <p>
                Depending on your location, you may have rights to access,
                correct, delete, or restrict processing of your personal data,
                and to object to certain processing. To exercise these rights,
                email{" "}
                <a href="mailto:sifatali008@gmail.com">sifatali008@gmail.com</a>{" "}
                with enough detail to locate your request (for example the email
                you used on a form).
              </p>
              <p>
                You can also stop submitting data by not using forms or chat. For
                cookie/session data, sign out of the admin area and clear site
                data in your browser.
              </p>
            </>
          ),
        },
        {
          title: "Children",
          body: (
            <p>
              The Site is not directed at children under 16. I do not knowingly
              collect personal information from children. If you believe a child
              submitted data, contact me and I will delete it.
            </p>
          ),
        },
        {
          title: "International transfers",
          body: (
            <p>
              Providers may process data in the United States or other
              countries. If you access the Site from the EEA/UK or similar
              regions, that may involve cross-border transfers subject to the
              provider’s safeguards.
            </p>
          ),
        },
        {
          title: "Changes",
          body: (
            <p>
              I may update this policy when the Site or processors change. The
              “Last updated” date at the top will change when material updates
              are published. Continued use of the Site after an update means you
              accept the revised policy for future use.
            </p>
          ),
        },
        {
          title: "Related",
          body: (
            <p>
              See also the{" "}
              <Link href="/security">Security</Link> page for technical and
              operational safeguards.
            </p>
          ),
        },
      ]}
    />
  );
}
