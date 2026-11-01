
import { useCallback, useEffect, useState } from "react";
import { API_BASE } from "./apiConfig";

const CATEGORIES = [
  "Venue",
  "Food",
  "Tent & Decor",
  "DJ",
  "Jaimala",
  "Clothing",
  "Photography",
  "Transport",
  "Gifts",
  "Other",
];

const EMPTY_FORM = {
  title: "",
  category: "Food",
  estimatedCost: "",
  actualCost: "",
  advancePaid: "",
  dueDate: "",
  notes: "",
};

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function BudgetManager({ authData }) {
  const token = authData?.token;

  const [budget, setBudget] = useState(null);
  const [totalBudget, setTotalBudget] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const request = useCallback(
    async (path, options = {}) => {
      if (!token) throw new Error("Please login to manage your budget.");

      const response = await fetch(`${API_BASE}/api/budget${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Request failed. Please try again.");
      }

      return data;
    },
    [token]
  );

  const loadBudget = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await request("/");
      setBudget(data);
      setTotalBudget(String(data.totalBudget ?? 0));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    loadBudget();
  }, [loadBudget]);

  const updateTotalBudget = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const data = await request("/total", {
        method: "PUT",
        body: JSON.stringify({ totalBudget: Number(totalBudget) }),
      });

      setBudget(data);
      setTotalBudget(String(data.totalBudget ?? 0));
      setNotice("Total wedding budget saved successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const saveExpense = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      ...form,
      estimatedCost: Number(form.estimatedCost),
      actualCost: Number(form.actualCost || 0),
      advancePaid: Number(form.advancePaid || 0),
    };

    try {
      const data = await request(
        editingId ? `/expenses/${editingId}` : "/expenses",
        {
          method: editingId ? "PUT" : "POST",
          body: JSON.stringify(payload),
        }
      );

      setBudget(data);
      setForm(EMPTY_FORM);
      setEditingId(null);
      setNotice(editingId ? "Expense updated." : "Expense added successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const editExpense = (expense) => {
    setEditingId(expense._id);
    setForm({
      title: expense.title || "",
      category: expense.category || "Other",
      estimatedCost: String(expense.estimatedCost ?? ""),
      actualCost: String(expense.actualCost ?? 0),
      advancePaid: String(expense.advancePaid ?? 0),
      dueDate: expense.dueDate || "",
      notes: expense.notes || "",
    });

    setNotice("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    setError("");
    setNotice("");

    try {
      const data = await request(`/expenses/${id}`, {
        method: "DELETE",
      });

      setBudget(data);
      if (editingId === id) {
        setEditingId(null);
        setForm(EMPTY_FORM);
      }
      setNotice("Expense deleted.");
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setNotice("");
  };

  const expenses = budget?.expenses || [];
  const actualTotal = expenses.reduce(
    (sum, item) => sum + Number(item.actualCost || 0),
    0
  );
  const estimatedTotal = expenses.reduce(
    (sum, item) => sum + Number(item.estimatedCost || 0),
    0
  );
  const advanceTotal = expenses.reduce(
    (sum, item) => sum + Number(item.advancePaid || 0),
    0
  );
  const pendingTotal = expenses.reduce(
    (sum, item) =>
      sum +
      Math.max(
        0,
        Number(item.actualCost || 0) - Number(item.advancePaid || 0)
      ),
    0
  );
  const remaining = Number(budget?.totalBudget || 0) - actualTotal;

  if (loading) {
    return <div style={styles.message}>Loading your wedding budget...</div>;
  }

  if (!token) {
    return (
      <div style={styles.message}>
        Please login first to manage your wedding budget.
      </div>
    );
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>MILAP • WEDDING PLANNER</p>
          <h1 style={styles.heading}>Wedding Budget Manager</h1>
          <p style={styles.subtitle}>
            Plan expenses, track payments and stay within your budget.
          </p>
        </div>
        <button style={styles.secondaryButton} onClick={loadBudget}>
          Refresh
        </button>
      </header>

      {error && <div style={styles.error}>{error}</div>}
      {notice && <div style={styles.success}>{notice}</div>}

      <section style={styles.cards}>
        <SummaryCard
          title="Total Budget"
          value={money(budget?.totalBudget)}
          color="#4338ca"
        />
        <SummaryCard
          title="Actual Expenses"
          value={money(actualTotal)}
          color="#b45309"
        />
        <SummaryCard
          title="Remaining Budget"
          value={money(remaining)}
          color={remaining < 0 ? "#dc2626" : "#15803d"}
        />
        <SummaryCard
          title="Pending Payments"
          value={money(pendingTotal)}
          color="#be123c"
        />
      </section>

      <section style={styles.panel}>
        <h2 style={styles.sectionTitle}>Set Total Wedding Budget</h2>
        <form onSubmit={updateTotalBudget} style={styles.budgetForm}>
          <label style={styles.label}>
            Your budget (₹)
            <input
              style={styles.input}
              type="number"
              min="0"
              max="100000000"
              step="1"
              required
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
            />
          </label>
          <button style={styles.primaryButton} disabled={saving}>
            {saving ? "Saving..." : "Save Budget"}
          </button>
        </form>
      </section>

      <section style={styles.panel}>
        <h2 style={styles.sectionTitle}>
          {editingId ? "Edit Expense" : "Add Wedding Expense"}
        </h2>

        <form onSubmit={saveExpense} style={styles.formGrid}>
          <label style={styles.label}>
            Expense name *
            <input
              style={styles.input}
              required
              maxLength={100}
              placeholder="e.g. Wedding tent"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />
          </label>

          <label style={styles.label}>
            Category *
            <select
              style={styles.input}
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.label}>
            Estimated cost (₹) *
            <input
              style={styles.input}
              type="number"
              min="0"
              max="100000000"
              step="1"
              required
              value={form.estimatedCost}
              onChange={(e) =>
                setForm({ ...form, estimatedCost: e.target.value })
              }
            />
          </label>

          <label style={styles.label}>
            Actual cost (₹)
            <input
              style={styles.input}
              type="number"
              min="0"
              max="100000000"
              step="1"
              value={form.actualCost}
              onChange={(e) =>
                setForm({ ...form, actualCost: e.target.value })
              }
            />
          </label>

          <label style={styles.label}>
            Advance paid (₹)
            <input
              style={styles.input}
              type="number"
              min="0"
              max="100000000"
              step="1"
              value={form.advancePaid}
              onChange={(e) =>
                setForm({ ...form, advancePaid: e.target.value })
              }
            />
          </label>

          <label style={styles.label}>
            Payment due date
            <input
              style={styles.input}
              type="date"
              value={form.dueDate}
              onChange={(e) =>
                setForm({ ...form, dueDate: e.target.value })
              }
            />
          </label>

          <label style={{ ...styles.label, gridColumn: "1 / -1" }}>
            Notes
            <textarea
              style={{ ...styles.input, minHeight: 80, resize: "vertical" }}
              maxLength={1000}
              placeholder="Vendor details, payment plan, etc."
              value={form.notes}
              onChange={(e) =>
                setForm({ ...form, notes: e.target.value })
              }
            />
          </label>

          <div style={styles.formActions}>
            <button style={styles.primaryButton} disabled={saving}>
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Expense"
                  : "Add Expense"}
            </button>

            {editingId && (
              <button
                type="button"
                style={styles.secondaryButton}
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section style={styles.panel}>
        <div style={styles.listHeader}>
          <h2 style={styles.sectionTitle}>Expense List</h2>
          <span style={styles.count}>{expenses.length} expenses</span>
        </div>

        {expenses.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: 36 }}>🧾</div>
            <h3>No expenses added yet</h3>
            <p>Add your first wedding expense using the form above.</p>
          </div>
        ) : (
          <div style={styles.expenseList}>
            {expenses.map((expense) => {
              const actual = Number(expense.actualCost || 0);
              const advance = Number(expense.advancePaid || 0);
              const due = Math.max(0, actual - advance);

              return (
                <article key={expense._id} style={styles.expense}>
                  <div style={styles.expenseTop}>
                    <div style={{ minWidth: 0 }}>
                      <h3 style={styles.expenseTitle}>{expense.title}</h3>
                      <span style={styles.category}>
                        {expense.category}
                      </span>
                    </div>
                    <strong style={styles.expenseAmount}>
                      {money(actual)}
                    </strong>
                  </div>

                  <div style={styles.details}>
                    <span>Estimated: {money(expense.estimatedCost)}</span>
                    <span>Advance: {money(advance)}</span>
                    <span>Due: {money(due)}</span>
                    {expense.dueDate && (
                      <span>Due date: {expense.dueDate}</span>
                    )}
                  </div>

                  {expense.notes && (
                    <p style={styles.notes}>{expense.notes}</p>
                  )}

                  <div style={styles.expenseActions}>
                    <button
                      style={styles.secondaryButton}
                      onClick={() => editExpense(expense)}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.deleteButton}
                      onClick={() => deleteExpense(expense._id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div style={styles.footerTotals}>
          <span>Estimated total: <strong>{money(estimatedTotal)}</strong></span>
          <span>Paid in advance: <strong>{money(advanceTotal)}</strong></span>
          <span>Pending: <strong>{money(pendingTotal)}</strong></span>
        </div>
      </section>
    </main>
  );
}

function SummaryCard({ title, value, color }) {
  return (
    <article style={styles.summaryCard}>
      <p style={styles.summaryTitle}>{title}</p>
      <h2 style={{ ...styles.summaryValue, color }}>{value}</h2>
    </article>
  );
}

const styles = {
  page: {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
    padding: "28px 20px 48px",
    boxSizing: "border-box",
    color: "#172033",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 24,
  },
  eyebrow: {
    color: "#6d28d9",
    fontWeight: 800,
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  heading: { fontSize: "clamp(25px, 4vw, 36px)", margin: "0 0 8px" },
  subtitle: { color: "#64748b", margin: 0, lineHeight: 1.6 },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 14,
    marginBottom: 22,
  },
  summaryCard: {
    padding: 20,
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 3px 12px rgba(15,23,42,.04)",
    minWidth: 0,
  },
  summaryTitle: { margin: 0, color: "#64748b", fontSize: 14 },
  summaryValue: {
    fontSize: "clamp(21px, 3vw, 28px)",
    margin: "12px 0 0",
    overflowWrap: "anywhere",
  },
  panel: {
    padding: 22,
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    background: "#fff",
    marginBottom: 22,
    boxShadow: "0 3px 12px rgba(15,23,42,.035)",
  },
  sectionTitle: { fontSize: 20, margin: "0 0 18px" },
  budgetForm: {
    display: "flex",
    alignItems: "end",
    gap: 14,
    flexWrap: "wrap",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: 7,
    fontSize: 13,
    fontWeight: 700,
    color: "#475569",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #cbd5e1",
    borderRadius: 9,
    padding: "11px 12px",
    font: "inherit",
    fontSize: 14,
    color: "#172033",
    background: "#fff",
  },
  primaryButton: {
    border: 0,
    borderRadius: 9,
    background: "#6d28d9",
    color: "#fff",
    fontWeight: 700,
    padding: "12px 18px",
    cursor: "pointer",
  },
  secondaryButton: {
    border: "1px solid #cbd5e1",
    borderRadius: 9,
    background: "#fff",
    color: "#334155",
    fontWeight: 700,
    padding: "10px 14px",
    cursor: "pointer",
  },
  deleteButton: {
    border: "1px solid #fecaca",
    borderRadius: 9,
    background: "#fff1f2",
    color: "#be123c",
    fontWeight: 700,
    padding: "10px 14px",
    cursor: "pointer",
  },
  formActions: {
    gridColumn: "1 / -1",
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },
  error: {
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    color: "#9f1239",
    padding: 13,
    borderRadius: 10,
    marginBottom: 18,
  },
  success: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#166534",
    padding: 13,
    borderRadius: 10,
    marginBottom: 18,
  },
  message: {
    maxWidth: 900,
    margin: "40px auto",
    padding: 24,
    textAlign: "center",
  },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  count: {
    background: "#f1f5f9",
    color: "#475569",
    borderRadius: 20,
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 700,
  },
  empty: {
    padding: "32px 12px",
    textAlign: "center",
    border: "1px dashed #cbd5e1",
    borderRadius: 12,
    color: "#64748b",
  },
  expenseList: { display: "grid", gap: 12 },
  expense: {
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: 16,
    minWidth: 0,
  },
  expenseTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    gap: 12,
    flexWrap: "wrap",
  },
  expenseTitle: { margin: "0 0 8px", fontSize: 17, overflowWrap: "anywhere" },
  category: {
    display: "inline-block",
    borderRadius: 20,
    background: "#f3e8ff",
    color: "#6b21a8",
    padding: "5px 9px",
    fontSize: 12,
    fontWeight: 700,
  },
  expenseAmount: { fontSize: 19, color: "#0f766e" },
  details: {
    display: "flex",
    gap: "10px 18px",
    flexWrap: "wrap",
    marginTop: 16,
    color: "#475569",
    fontSize: 13,
  },
  notes: {
    whiteSpace: "pre-wrap",
    color: "#64748b",
    fontSize: 13,
    lineHeight: 1.6,
  },
  expenseActions: {
    display: "flex",
    justifyContent: "end",
    gap: 8,
    marginTop: 14,
  },
  footerTotals: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
    borderTop: "1px solid #e2e8f0",
    paddingTop: 18,
    marginTop: 20,
    color: "#475569",
    fontSize: 13,
  },
};
