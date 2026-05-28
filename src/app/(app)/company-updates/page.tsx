"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, ChevronDown, Plus, Search } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { CompanyUpdateDetailPanel } from "@/components/company-updates/CompanyUpdateDetailPanel";
import { CompanyUpdateListItem } from "@/components/company-updates/CompanyUpdateListItem";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Select, Textarea } from "@/components/ui/input";
import type { CAUser, CompanyUpdate, ShareStatus, Student } from "@/lib/data/types";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import { fetchJson, fetchJsonMutation } from "@/lib/api/fetch-json";
import { cn } from "@/lib/utils/cn";

type FilterTab = "all" | "unshared" | "in_progress" | "completed";

export default function CompanyUpdatesPage() {
  const [updates, setUpdates] = useState<CompanyUpdate[]>([]);
  const [cas, setCas] = useState<CAUser[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selected, setSelected] = useState<CompanyUpdate | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");
  const [form, setForm] = useState({
    companyName: "",
    title: "",
    content: "",
    priority: "medium" as "high" | "medium" | "low",
    deadline: "",
    relatedCaIds: [] as string[],
    relatedStudentIds: [] as string[],
  });

  const load = async () => {
    const list = await fetchJson<CompanyUpdate[]>("/api/company-updates", {
      fallback: () => clientMockFallback.companyUpdates(),
    });
    setUpdates(list);
    setSelected((prev) => {
      if (prev && list.some((u) => u.id === prev.id)) {
        return list.find((u) => u.id === prev.id) ?? prev;
      }
      return list[0] ?? null;
    });
  };

  useEffect(() => {
    void load();
    void fetchJson<CAUser[]>("/api/cas", {
      fallback: () => clientMockFallback.cas(),
    }).then(setCas);
    void fetchJson<Student[]>("/api/students", {
      fallback: () => clientMockFallback.students(),
    }).then(setStudents);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const unshared = updates.filter((u) => u.shareStatus === "unshared").length;
    const inProgress = updates.filter(
      (u) => u.shareStatus === "shared_ca" || u.shareStatus === "shared_student"
    ).length;
    const completed = updates.filter((u) => u.shareStatus === "completed").length;
    return { total: updates.length, unshared, inProgress, completed };
  }, [updates]);

  const filtered = useMemo(() => {
    let list = updates;
    if (filter === "unshared") {
      list = list.filter((u) => u.shareStatus === "unshared");
    } else if (filter === "in_progress") {
      list = list.filter(
        (u) =>
          u.shareStatus === "shared_ca" || u.shareStatus === "shared_student"
      );
    } else if (filter === "completed") {
      list = list.filter((u) => u.shareStatus === "completed");
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (u) =>
          u.companyName.toLowerCase().includes(q) ||
          u.title.toLowerCase().includes(q) ||
          u.content.toLowerCase().includes(q)
      );
    }
    return list.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [updates, filter, query]);

  const filterTabs: { id: FilterTab; label: string; count: number }[] = [
    { id: "all", label: "すべて", count: stats.total },
    { id: "unshared", label: "未共有", count: stats.unshared },
    { id: "in_progress", label: "共有中", count: stats.inProgress },
    { id: "completed", label: "完了", count: stats.completed },
  ];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/company-updates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        deadline: form.deadline || new Date().toISOString(),
      }),
    });
    setForm({
      companyName: "",
      title: "",
      content: "",
      priority: "medium",
      deadline: "",
      relatedCaIds: [],
      relatedStudentIds: [],
    });
    setFormOpen(false);
    void load();
  };

  const updateStatus = async (id: string, shareStatus: ShareStatus) => {
    const updated = await fetchJsonMutation<CompanyUpdate>(
      `/api/company-updates/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shareStatus }),
      }
    );
    if (updated) {
      setSelected(updated);
      void load();
    } else if (selected?.id === id) {
      setSelected({ ...selected, shareStatus });
    }
  };

  const runAiSuggest = async () => {
    if (!selected) return;
    setAiLoading(true);
    const data = await fetchJsonMutation<{
      aiSummary: string;
      lineShareText: string;
    }>("/api/company-updates/ai-suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selected),
    });
    const aiSummary =
      data?.aiSummary ?? `【${selected.companyName}】${selected.title}`;
    const lineShareText =
      data?.lineShareText ??
      `【企業連絡】${selected.companyName}\n${selected.content.slice(0, 100)}`;

    await fetchJsonMutation(`/api/company-updates/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aiSummary, lineShareText }),
    });
    setSelected({ ...selected, aiSummary, lineShareText });
    setAiLoading(false);
    void load();
  };

  const copyLine = () => {
    if (selected?.lineShareText) {
      void navigator.clipboard.writeText(selected.lineShareText);
    }
  };

  return (
    <>
      <TopBar
        title="企業連絡"
        description={`${stats.total}件 · 未共有 ${stats.unshared}件`}
        actions={
          <Button size="md" onClick={() => setFormOpen((o) => !o)}>
            <Plus className="h-4 w-4" />
            新規登録
          </Button>
        }
      />

      <div className="flex min-h-0 flex-1 overflow-hidden bg-background-subtle">
        {/* 左: 一覧 */}
        <div className="flex min-h-0 w-full max-w-xl flex-col border-r border-border bg-background lg:max-w-2xl">
          {/* サマリー */}
          <div className="grid grid-cols-3 gap-2 border-b border-border-subtle p-4">
            <div className="rounded-lg bg-warning-subtle/60 px-3 py-2.5 text-center ring-1 ring-warning/15">
              <p className="text-2xl font-semibold tabular-nums text-warning">
                {stats.unshared}
              </p>
              <p className="text-[11px] font-medium text-foreground-muted">
                未共有
              </p>
            </div>
            <div className="rounded-lg bg-accent-subtle/60 px-3 py-2.5 text-center ring-1 ring-accent/15">
              <p className="text-2xl font-semibold tabular-nums text-accent">
                {stats.inProgress}
              </p>
              <p className="text-[11px] font-medium text-foreground-muted">
                共有中
              </p>
            </div>
            <div className="rounded-lg bg-success-subtle/60 px-3 py-2.5 text-center ring-1 ring-success/15">
              <p className="text-2xl font-semibold tabular-nums text-success">
                {stats.completed}
              </p>
              <p className="text-[11px] font-medium text-foreground-muted">
                完了
              </p>
            </div>
          </div>

          {formOpen && (
            <Card className="m-4 border-accent/20 p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                企業連絡を登録
              </h3>
              <form onSubmit={handleCreate} className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="企業名"
                    value={form.companyName}
                    onChange={(e) =>
                      setForm({ ...form, companyName: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="タイトル"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    required
                  />
                </div>
                <Textarea
                  label="内容"
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  rows={3}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Select
                    label="重要度"
                    value={form.priority}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        priority: e.target.value as "high" | "medium" | "low",
                      })
                    }
                  >
                    <option value="high">高</option>
                    <option value="medium">中</option>
                    <option value="low">低</option>
                  </Select>
                  <Input
                    label="期限"
                    type="date"
                    value={form.deadline}
                    onChange={(e) =>
                      setForm({ ...form, deadline: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm">
                    登録する
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setFormOpen(false)}
                  >
                    閉じる
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <div className="space-y-3 border-b border-border-subtle px-4 pb-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
              <input
                type="search"
                placeholder="企業名・タイトルで検索"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-9 w-full rounded-lg border border-border bg-background-subtle pl-9 pr-3 text-sm shadow-xs focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    filter === tab.id
                      ? "bg-foreground text-background"
                      : "bg-background-subtle text-foreground-muted hover:text-foreground-secondary"
                  )}
                >
                  {tab.label}
                  <span className="ml-1 tabular-nums opacity-80">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto scroll-area scroll-smooth p-4">
            {filtered.length === 0 ? (
              <EmptyState
                icon={Building2}
                title="該当する連絡がありません"
                description="フィルタを変えるか、新規登録してください"
              />
            ) : (
              <ul className="space-y-3">
                {filtered.map((u) => (
                  <li key={u.id}>
                    <CompanyUpdateListItem
                      update={u}
                      selected={selected?.id === u.id}
                      onSelect={() => setSelected(u)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 右: 詳細 */}
        <div className="hidden min-h-0 min-w-0 flex-1 bg-background lg:flex lg:flex-col">
          {selected ? (
            <CompanyUpdateDetailPanel
              update={selected}
              cas={cas}
              students={students}
              aiLoading={aiLoading}
              onStatusChange={(s) => updateStatus(selected.id, s)}
              onAiSuggest={runAiSuggest}
              onCopyLine={copyLine}
            />
          ) : (
            <EmptyState
              icon={Building2}
              title="連絡を選択してください"
              description="左の一覧から企業連絡を選ぶと、詳細と共有ステータスを編集できます"
              className="h-full"
            />
          )}
        </div>
      </div>

      {/* モバイル: 選択時のみ詳細を下に表示 */}
      {selected && (
        <div className="border-t border-border bg-background lg:hidden">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-1 py-2 text-xs text-foreground-muted"
            onClick={() => setSelected(null)}
          >
            一覧に戻る
            <ChevronDown className="h-4 w-4" />
          </button>
          <CompanyUpdateDetailPanel
            update={selected}
            cas={cas}
            students={students}
            aiLoading={aiLoading}
            onStatusChange={(s) => updateStatus(selected.id, s)}
            onAiSuggest={runAiSuggest}
            onCopyLine={copyLine}
          />
        </div>
      )}
    </>
  );
}
