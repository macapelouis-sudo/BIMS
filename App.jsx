
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000";

const modules = {
  Residents: {
    endpoint: "residents",
    fields: [
      ["name", "Full Name"],
      ["age", "Age"],
      ["address", "Address"],
      ["contact", "Contact Number"]
    ]
  },
  Announcements: {
    endpoint: "announcements",
    fields: [
      ["title", "Title"],
      ["date", "Date"],
      ["description", "Description"]
    ]
  },
  Reports: {
    endpoint: "reports",
    fields: [
      ["title", "Report Title"],
      ["category", "Category"],
      ["date", "Date"],
      ["description", "Description"],
      ["status", "Status"]
    ]
  },
  Requests: {
    endpoint: "requests",
    fields: [
      ["resident", "Resident Name"],
      ["service", "Requested Service"],
      ["date", "Date"],
      ["status", "Status"]
    ]
  }
};

const icons = {
  Dashboard: "▦",
  Residents: "♙",
  Announcements: "▤",
  Reports: "▧",
  Requests: "☷"
};

function App() {
  const [page, setPage] = useState("Dashboard");
  const [dashboard, setDashboard] = useState({});
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const config = modules[page];

  async function loadDashboard() {
    try {
      const response = await fetch(`${API}/dashboard`);

      if (!response.ok) {
        throw new Error("Could not load dashboard.");
      }

      setDashboard(await response.json());
    } catch {
      setMessage(
        "Cannot connect to the backend. Start server.js first."
      );
    }
  }

  async function loadItems() {
    if (!config) return;

    setLoading(true);

    try {
      const response = await fetch(`${API}/${config.endpoint}`);

      if (!response.ok) {
        throw new Error("Could not load records.");
      }

      setItems(await response.json());
    } catch {
      setMessage("Could not load records. Check your backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    setItems([]);
    setForm({});
    setEditingId(null);
    setSearch("");

    if (config) {
      loadItems();
    } else {
      loadDashboard();
    }
  }, [page]);

  async function saveRecord(event) {
    event.preventDefault();

    try {
      const url =
        `${API}/${config.endpoint}` +
        (editingId !== null ? `/${editingId}` : "");

      const response = await fetch(url, {
        method: editingId !== null ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not save record.");
      }

      setMessage(result.message);
      setForm({});
      setEditingId(null);

      await loadItems();
      await loadDashboard();
    } catch (error) {
      setMessage(error.message || "Could not save record.");
    }
  }

  async function deleteRecord(id) {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/${config.endpoint}/${id}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not delete record.");
      }

      setMessage(result.message);

      await loadItems();
      await loadDashboard();
    } catch (error) {
      setMessage(error.message || "Could not delete record.");
    }
  }

  function editRecord(item) {
    setEditingId(item.id);
    setForm({ ...item });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({});
  }

  const visibleItems = items.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">M</div>
          <div>
            <h2>MOCAG</h2>
            <span>BARANGAY SYSTEM</span>
          </div>
        </div>

        <div className="nav-caption">MAIN MENU</div>

        {["Dashboard", ...Object.keys(modules)].map(name => (
          <button
            key={name}
            className={`nav-link ${page === name ? "selected" : ""}`}
            onClick={() => {
              setPage(name);
              setMessage("");
            }}
          >
            <span className="nav-icon">{icons[name]}</span>
            {name}
          </button>
        ))}

        <div className="sidebar-bottom">
          <div className="online-dot" />
          <div>
            <strong>Mocag, Baggao</strong>
            <small>Cagayan, Philippines</small>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <div className="eyebrow">
              BARANGAY INFORMATION MANAGEMENT
            </div>
            <h1>{page}</h1>
          </div>

          <div className="user-chip">
            <div className="user-avatar">BS</div>
            <div>
              <strong>Barangay Staff</strong>
              <small>System User</small>
            </div>
          </div>
        </header>

        {message && (
          <div className="notice" role="status">
            <span>{message}</span>
            <button onClick={() => setMessage("")}>×</button>
          </div>
        )}

        {page === "Dashboard" ? (
          <>
            <section className="hero">
              <div className="hero-content">
                <div className="hero-label">
                  <span className="gold-dot" />
                  COMMUNITY ADMINISTRATION PORTAL
                </div>

                <h2>
                  Welcome to Mocag
                  <br />
                  Barangay Management
                </h2>

                <p>
                  A simpler way to manage resident records,
                  community announcements, reports, and service requests.
                </p>

                <button
                  className="hero-button"
                  onClick={() => setPage("Residents")}
                >
                  Manage Residents <span>→</span>
                </button>
              </div>

              <div className="hero-seal">
                <div className="seal-ring">
                  <span>M</span>
                  <small>BARANGAY<br />MOCAG</small>
                </div>
              </div>

              <div className="hero-decoration" />
            </section>

            <section className="section-heading">
              <div>
                <span className="eyebrow">AT A GLANCE</span>
                <h2>Barangay Overview</h2>
              </div>

              <span className="live-tag">
                <i /> Live summary
              </span>
            </section>

            <section className="stats-grid">
              {[
                [
                  "Total Residents",
                  dashboard.totalResidents,
                  "♙",
                  "Residents registered"
                ],
                [
                  "Announcements",
                  dashboard.totalAnnouncements,
                  "▤",
                  "Community updates"
                ],
                [
                  "Total Reports",
                  dashboard.totalReports,
                  "▧",
                  "Reports recorded"
                ],
                [
                  "Pending Requests",
                  dashboard.pendingRequests,
                  "◷",
                  "Awaiting action"
                ]
              ].map(([label, value, icon, description], index) => (
                <article className={`stat-card stat-${index}`} key={label}>
                  <div className="stat-top">
                    <span className="stat-icon">{icon}</span>
                    <span className="stat-arrow">↗</span>
                  </div>

                  <p>{label}</p>
                  <h3>{value ?? "—"}</h3>
                  <small>{description}</small>
                </article>
              ))}
            </section>

            <section className="panel quick-panel">
              <div className="panel-title">
                <div>
                  <span className="eyebrow">GET THINGS DONE</span>
                  <h2>Quick Access</h2>
                  <p>Choose a module to manage barangay information.</p>
                </div>
              </div>

              <div className="quick-grid">
                {Object.keys(modules).map(name => (
                  <button
                    className="quick-card"
                    key={name}
                    onClick={() => setPage(name)}
                  >
                    <span className="quick-symbol">{icons[name]}</span>
                    <span className="quick-copy">
                      <strong>{name}</strong>
                      <small>Open {name.toLowerCase()}</small>
                    </span>
                    <span className="quick-arrow">→</span>
                  </button>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="panel data-panel">
            <div className="panel-title">
              <div>
                <span className="eyebrow">RECORD MANAGEMENT</span>
                <h2>
                  {editingId !== null ? "Edit Record" : `Manage ${page}`}
                </h2>
                <p>Add new information or update existing records.</p>
              </div>

              <span className="record-pill">
                {items.length} records
              </span>
            </div>

            <form className="record-form" onSubmit={saveRecord}>
              {config.fields.map(([key, label]) => (
                <label key={key}>
                  {label}

                  {key === "description" ? (
                    <textarea
                      required
                      value={form[key] ?? ""}
                      onChange={event =>
                        setForm({
                          ...form,
                          [key]: event.target.value
                        })
                      }
                    />
                  ) : key === "date" ? (
                    <input
                      type="date"
                      required
                      value={form[key] ?? ""}
                      onChange={event =>
                        setForm({
                          ...form,
                          [key]: event.target.value
                        })
                      }
                    />
                  ) : key === "status" ? (
                    <select
                      required
                      value={form[key] ?? "Pending"}
                      onChange={event =>
                        setForm({
                          ...form,
                          [key]: event.target.value
                        })
                      }
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Approved</option>
                      <option>Rejected</option>
                      <option>Resolved</option>
                    </select>
                  ) : (
                    <input
                      required
                      type={key === "age" ? "number" : "text"}
                      min={key === "age" ? 0 : undefined}
                      value={form[key] ?? ""}
                      onChange={event =>
                        setForm({
                          ...form,
                          [key]: event.target.value
                        })
                      }
                    />
                  )}
                </label>
              ))}

              <div className="form-actions">
                <button className="primary-button" type="submit">
                  {editingId !== null ? "Save Changes" : "+ Add Record"}
                </button>

                {editingId !== null && (
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="table-heading">
              <div>
                <h3>{page} List</h3>
                <p>View and manage existing records.</p>
              </div>

              <input
                className="search-input"
                placeholder="Search records..."
                value={search}
                onChange={event => setSearch(event.target.value)}
              />
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    {config.fields.map(([key, label]) => (
                      <th key={key}>{label}</th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleItems.map(item => (
                    <tr key={item.id}>
                      <td>
                        <span className="id-chip">#{item.id}</span>
                      </td>

                      {config.fields.map(([key]) => (
                        <td key={key}>
                          {key === "status" ? (
                            <span
                              className={
                                "status status-" +
                                String(item[key])
                                  .toLowerCase()
                                  .replaceAll(" ", "-")
                              }
                            >
                              {item[key]}
                            </span>
                          ) : (
                            item[key]
                          )}
                        </td>
                      ))}

                      <td className="actions">
                        <button
                          className="edit-button"
                          onClick={() => editRecord(item)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => deleteRecord(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {!loading && visibleItems.length === 0 && (
                    <tr>
                      <td
                        className="empty-cell"
                        colSpan={config.fields.length + 2}
                      >
                        No records found. Add your first record above.
                      </td>
                    </tr>
                  )}

                  {loading && (
                    <tr>
                      <td
                        className="empty-cell"
                        colSpan={config.fields.length + 2}
                      >
                        Loading records...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <footer className="footer">
          <span>
            © 2026 Mocag Barangay Information Management System
          </span>
          <span>Serving the community with care ♥</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
