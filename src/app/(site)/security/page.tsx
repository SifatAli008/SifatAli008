import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Security - Sifat Ali",
    description:
      "Security practices for sifatali.site: Firebase rules, auth boundaries, contact data handling, AI chat limits, and responsible disclosure.",
    path: "/security",
  }),
  title: { absolute: "Security | Sifat Ali" },
};

export default function SecurityPage() {
  return (
    <LegalPage
      eyebrow="Legal / 02"
      title="Security"
      updated="2 August 2026"
      intro="This page summarizes how sifatali.site is protected and how you can report a vulnerability. It is an engineering summary, not a certification or compliance attestation."
      sections={[
        {
          title: "Security principles",
          body: (
            <ul>
              <li>Least privilege for admin and write paths.</li>
              <li>Public content is read-oriented; privileged actions require auth.</li>
              <li>Secrets stay in server environment variables, never in client bundles.</li>
              <li>User-submitted content is treated as untrusted input.</li>
            </ul>
          ),
        },
        {
          title: "Authentication and admin access",
          body: (
            <>
              <p>
                The dashboard is protected by Firebase Authentication and an
                allowlisted admin email check. Middleware and client guards block
                unauthenticated access to admin routes.
              </p>
              <ul>
                <li>
                  Session indicator cookie is set only after a successful admin
                  sign-in and is not used as the sole security boundary.
                </li>
                <li>
                  Admin capabilities (content edits, asset sync) are not exposed
                  to anonymous visitors.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "Data stores and rules",
          body: (
            <>
              <p>
                Contact and project inquiry submissions are written to Firestore
                when Firebase is configured. Security depends on deployed
                Firestore rules and Admin SDK credentials kept off the client.
              </p>
              <ul>
                <li>
                  Client apps use public Firebase config suitable for browser
                  use; privileged Admin SDK keys are server-only.
                </li>
                <li>
                  Publish and seed scripts require{" "}
                  <code className="font-mono text-sm">FIREBASE_ADMIN_*</code>{" "}
                  environment variables and must not be run in untrusted
                  environments.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "Transport and hosting",
          body: (
            <ul>
              <li>Production traffic is served over HTTPS.</li>
              <li>
                Hosting and edge platforms provide TLS termination and standard
                DDoS / edge protections according to the provider.
              </li>
              <li>
                Environment secrets (API keys, service accounts) are stored in
                the host’s secret/env configuration, not in git.
              </li>
            </ul>
          ),
        },
        {
          title: "AI chat safeguards",
          body: (
            <ul>
              <li>
                Chat requests go through a Site API route, not directly from the
                browser to every upstream key when server-mediated.
              </li>
              <li>
                The assistant is scoped to portfolio / contact guidance; it is
                not a privileged admin tool.
              </li>
              <li>
                Do not submit passwords, API keys, medical data, or other
                sensitive secrets into chat.
              </li>
              <li>
                Upstream model providers may process prompts to generate
                responses; see the{" "}
                <Link href="/privacy">Privacy Policy</Link>.
              </li>
            </ul>
          ),
        },
        {
          title: "Application controls",
          body: (
            <ul>
              <li>
                Form submissions are validated on the client and treated as
                untrusted on write.
              </li>
              <li>
                Admin upload and sync endpoints check for an authenticated
                session before performing privileged work.
              </li>
              <li>
                Dependency updates and linting are part of normal maintenance;
                run <code className="font-mono text-sm">npm audit</code> / lockfile
                reviews before major deploys when possible.
              </li>
            </ul>
          ),
        },
        {
          title: "What I ask of you",
          body: (
            <ul>
              <li>Use strong unique passwords for any admin account.</li>
              <li>Do not share admin credentials or service-account JSON.</li>
              <li>
                Report suspected abuse of contact forms or chat promptly.
              </li>
            </ul>
          ),
        },
        {
          title: "Responsible disclosure",
          body: (
            <>
              <p>
                If you find a security issue, please email{" "}
                <a href="mailto:sifatali008@gmail.com">sifatali008@gmail.com</a>{" "}
                with:
              </p>
              <ul>
                <li>A clear description of the issue and impact</li>
                <li>Steps to reproduce (proof of concept without harm)</li>
                <li>Your contact details for follow-up</li>
              </ul>
              <p>
                Please do not publicly disclose the issue until I have had a
                reasonable window to investigate and fix it. Please do not
                access other people’s data, disrupt the service, or run
                destructive tests.
              </p>
            </>
          ),
        },
        {
          title: "Limitations",
          body: (
            <p>
              No system is perfectly secure. This Site is a personal portfolio
              and content platform. For regulated workloads (for example
              clinical PHI), do not upload sensitive datasets here; use a
              dedicated, contractually scoped environment instead.
            </p>
          ),
        },
        {
          title: "Related",
          body: (
            <p>
              Data handling details live in the{" "}
              <Link href="/privacy">Privacy Policy</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
