import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/button/Button";
import AdminTable from "../../components/ui/AdminTable";
import Toaster, { notify } from "../../components/ui/Toaster/Toaster";
import { useSettingsStore } from "../../stors/useSettingsStore";

const getId = (x) => x?.id ?? x?._id ?? x?.uuid ?? null;

export default function SettingsList({ onEdit }) {
  const navigate = useNavigate();

  const loading = useSettingsStore((s) => s.loading);
  const error = useSettingsStore((s) => s.error);
  const settings = useSettingsStore((s) => s.settings);

  const fetchSettings = useSettingsStore((s) => s.fetchSettings);
  const deleteSettings = useSettingsStore((s) => s.deleteSettings);

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSettings().catch((e) => {
      console.error("fetchSettings", e);
      notify.action("fetch").error("Failed to load settings");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShow = (row) => {
    const id = getId(row);

    // ✅ build query correctly
    const q = new URLSearchParams();
    if (id) q.set("id", id);
    q.set("readonly", "1");

    navigate(`/settings/form?${q.toString()}`);
  };

  const handleEdit = (row) => {
    if (onEdit) return onEdit(row);
    const id = getId(row);

    if (id) navigate(`/settings/form?id=${id}`);
    else navigate(`/settings/form`);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete current settings?")) return;
    try {
      setDeleting(true);
      await deleteSettings();
      notify.action("delete").success("Settings deleted");
    } catch (e) {
      console.error(e);
      notify.action("delete").error("Failed to delete settings");
    } finally {
      setDeleting(false);
    }
  };

  // single record UI
  const data = useMemo(() => (settings ? [settings] : []), [settings]);

  const columns = useMemo(
    () => [
      {
        key: "siteName",
        header: "Site",
        render: (row) => {
          const siteName = row.siteName || row.site_name || "—";
          const address = row.address || "—";
          return (
            <div className="min-w-0 max-w-[380px]">
              <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                {siteName}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {address}
              </div>
            </div>
          );
        },
      },
      {
        key: "email",
        header: "Email",
        render: (row) => (
          <a
            href={row.email ? `mailto:${row.email}` : undefined}
            className="text-brand-700 dark:text-brand-300 hover:underline block max-w-[260px] truncate"
            title={row.email || ""}
          >
            {row.email || "—"}
          </a>
        ),
      },
      {
        key: "phone",
        header: "Phone",
        render: (row) => (
          <span className="block max-w-[160px] truncate" title={row.phone || ""}>
            {row.phone || "—"}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div title="Site Settings | Dolphin Print">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader title="Site Settings" description="View and manage site contact/info settings">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Link to="/settings/form">
              <Button variant="primary" className="w-full sm:w-auto">
                + Add New
              </Button>
            </Link>

            {settings && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  variant="update"
                  onClick={() => handleEdit(settings)}
                  className="w-full sm:w-auto"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full sm:w-auto"
                >
                  {deleting ? "Deleting…" : "Delete"}
                </Button>
              </div>
            )}
          </div>
        </PageHeader>

        <main className="w-full pb-24">
          {loading && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
              Loading settings…
            </div>
          )}

          {!loading && error && <div className="text-center text-red-600">{String(error)}</div>}

          {!loading && !error && data.length === 0 && (
            <div className="text-center text-brand-600 px-4">
              No settings found. Click <strong>Add New</strong> to create.
            </div>
          )}

          {!loading && !error && data.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-brand-200 bg-white dark:bg-gray-800 shadow">
              <AdminTable
                title="Current Settings"
                data={data}
                columns={columns}
                onShow={(row) => handleShow(row)}
                onEdit={(row) => handleEdit(row)}
                onDelete={() => handleDelete()}
                onAdd={() => handleEdit(data[0])}
                addText="Edit Settings"
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
