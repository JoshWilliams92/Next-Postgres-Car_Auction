import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
};

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Basic account and auction preferences can live here until the full
          settings flow is implemented.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Account</h2>
          <div className="mt-4 space-y-4 text-sm text-gray-600">
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Display name
              </label>
              <input
                readOnly
                value="Coming soon"
                className="block w-full rounded-lg border-gray-200 bg-gray-50 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Email notifications
              </label>
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3">
                Bid alerts, watchlist updates, and account emails will be
                configurable here.
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Auction Preferences
          </h2>
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              Default currency: USD
            </div>
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              Default timezone: Local browser time
            </div>
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              Saved filters and notification thresholds can be added next.
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Developer</h2>
        <p className="mt-1 text-sm text-gray-500">
          Reset the database to the built-in placeholder data. This is
          destructive and cannot be undone.
        </p>
        <div className="mt-4"></div>
      </section>
    </div>
  );
}