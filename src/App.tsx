import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";
import * as XLSX from "xlsx";

type Status =
  | "not_started"
  | "in_progress"
  | "review"
  | "done"
  | "blocked"
  | "canceled";

type Priority = "urgent" | "high" | "medium" | "low";

type Category =
  | "engineering"
  | "funding"
  | "external"
  | "pr"
  | "operations";

type Task = {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  category: Category;
  assignee: string;
  startDate: string;
  endDate: string;
  progress: number;
  budgetPlanned: number;
  budgetActual: number;
  tags: string[];
};

type ViewKey = "dashboard" | "list" | "kanban" | "gantt" | "calendar" | "timeline";

type Member = {
  firstName: string;
  lastName: string;
  role: string;
  roleLevel: number;
  school: string;
  grade: string;
};

type MemberProfile = {
  authUserId: string;
  firstName: string;
  lastName: string;
  role: string;
  roleLevel: number;
  school: string | null;
  grade: string | null;
};

type PendingMember = {
  firstName: string;
  lastName: string;
  email: string;
};

const i18n = {
  appName: "SOARA タスクマネージャー",
  teamTag: "2026年 鳥人間コンテスト出場へ",
  ctaPrimary: "新規タスク",
  ctaSecondary: "スポンサー提案書",
  nav: {
    dashboard: "ダッシュボード",
    list: "一覧",
    kanban: "カンバン",
    gantt: "ガント",
    calendar: "カレンダー",
    timeline: "タイムライン",
  },
  filters: {
    search: "検索",
    status: "ステータス",
    priority: "優先度",
    category: "カテゴリ",
    reset: "リセット",
  },
  kpis: {
    total: "全タスク",
    completed: "完了",
    atRisk: "期限間近",
    budget: "予算消化",
  },
  alerts: "アラート",
  milestones: "重要マイルストーン",
  listHeading: "タスク一覧",
  kanbanHeading: "進捗カンバン",
  ganttHeading: "ガントチャート",
  calendarHeading: "今月のスケジュール",
  timelineHeading: "フェーズ別タイムライン",
  empty: "該当タスクなし",
};

const statusLabels: Record<Status, string> = {
  not_started: "未着手",
  in_progress: "進行中",
  review: "レビュー待ち",
  done: "完了",
  blocked: "保留",
  canceled: "キャンセル",
};

const priorityLabels: Record<Priority, string> = {
  urgent: "緊急",
  high: "高",
  medium: "中",
  low: "低",
};

const categoryLabels: Record<Category, string> = {
  engineering: "技術開発",
  funding: "資金調達",
  external: "渉外",
  pr: "広報",
  operations: "運営",
};

const members: Member[] = [
  {
    firstName: "Terumasa",
    lastName: "Iriyama",
    school: "開成高等学校",
    grade: "2年",
    role: "代表",
    roleLevel: 3,
  },
  {
    firstName: "Kazushi",
    lastName: "Takahashi",
    school: "渋谷教育学園渋谷高等学校",
    grade: "1年",
    role: "副代表/マーケティング班長",
    roleLevel: 2,
  },
  {
    firstName: "Motoki",
    lastName: "Nakajima",
    school: "St. Paul's School",
    grade: "11th Grade",
    role: "設計班長",
    roleLevel: 2,
  },
  {
    firstName: "Reishi",
    lastName: "Kikuchi",
    school: "角川ドワンゴ学園S高等学校（N高等学校と同じ）",
    grade: "3年",
    role: "空力設計",
    roleLevel: 1,
  },
  {
    firstName: "Yuki",
    lastName: "Wada",
    school: "開成高校",
    grade: "1年",
    role: "製作班長",
    roleLevel: 2,
  },
  {
    firstName: "Shawn",
    lastName: "Lian",
    school: "Seven Lakes High School",
    grade: "11th Grade",
    role: "設計班",
    roleLevel: 1,
  },
  {
    firstName: "Reito",
    lastName: "Ochi",
    school: "広尾学園高校インターナショナルコース",
    grade: "2年",
    role: "ソフトウェアエンジニア/マーケティング",
    roleLevel: 1,
  },
  {
    firstName: "Akito",
    lastName: "Hattori",
    school: "青稜高校",
    grade: "2年",
    role: "グラフィックデザイナー/電装設計",
    roleLevel: 1,
  },
  {
    firstName: "Yuto",
    lastName: "Hattori",
    school: "-",
    grade: "大学1年",
    role: "パイロット/メンター",
    roleLevel: 1,
  },
  {
    firstName: "Kyohei",
    lastName: "Nomura",
    school: "山口県立山口高等学校",
    grade: "2年",
    role: "ブランディングマネージャー",
    roleLevel: 2,
  },
  {
    firstName: "Daniel",
    lastName: "Kosukhin",
    school: "New York",
    grade: "11th Grade",
    role: "ソフトウェアエンジニア",
    roleLevel: 1,
  },
  {
    firstName: "Takemasa",
    lastName: "Suzuki",
    school: "筑波大学附属駒場高等学校",
    grade: "2年",
    role: "製作班",
    roleLevel: 1,
  },
  {
    firstName: "Jo",
    lastName: "Kataoka",
    school: "筑波大学附属駒場高等学校",
    grade: "2年",
    role: "製作班",
    roleLevel: 1,
  },
  {
    firstName: "Kosei",
    lastName: "Asaoka",
    school: "開成高校",
    grade: "2年",
    role: "製作班",
    roleLevel: 1,
  },
  {
    firstName: "Sosuke",
    lastName: "Koizumi",
    school: "慶應義塾高等学校",
    grade: "2年",
    role: "製作班",
    roleLevel: 1,
  },
  {
    firstName: "Ayato",
    lastName: "Yano",
    school: "ドルトン東京学園高等部",
    grade: "2年",
    role: "製作班",
    roleLevel: 1,
  },
  {
    firstName: "Takuma",
    lastName: "Yamazaki",
    school: "神奈川県立柏陽高等学校",
    grade: "2年",
    role: "マーケティング",
    roleLevel: 1,
  },
];

const milestones = [
  { date: "2025-12-15", label: "設計書初稿" },
  { date: "2026-02-01", label: "設計書提出" },
  { date: "2026-06-10", label: "テストフライト" },
  { date: "2026-07-20", label: "本番" },
];

const formatJPY = (value: number) =>
  new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(value);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("ja-JP", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));

const badgeTone: Record<Status, string> = {
  not_started: "bg-gray-100 text-gray-700",
  in_progress: "bg-soara-100 text-soara-700",
  review: "bg-sky/20 text-sky-dark",
  done: "bg-green/10 text-green",
  blocked: "bg-yellow/20 text-yellow",
  canceled: "bg-red/10 text-red",
};

const priorityTone: Record<Priority, string> = {
  urgent: "text-red",
  high: "text-soara-700",
  medium: "text-gray-600",
  low: "text-gray-500",
};

const views: ViewKey[] = ["dashboard", "list", "kanban", "gantt", "calendar", "timeline"];

const normalize = (value: string) => value.trim().toLowerCase();

const normalizeKey = (value: string) => normalize(value).replace(/\s+/g, "");

const parseStatus = (value: string): Status => {
  const key = normalizeKey(value);
  const map: Record<string, Status> = {
    not_started: "not_started",
    notstarted: "not_started",
    未着手: "not_started",
    in_progress: "in_progress",
    inprogress: "in_progress",
    進行中: "in_progress",
    review: "review",
    レビュー待ち: "review",
    done: "done",
    完了: "done",
    blocked: "blocked",
    保留: "blocked",
    canceled: "canceled",
    キャンセル: "canceled",
  };
  return map[key] ?? "not_started";
};

const parsePriority = (value: string): Priority => {
  const key = normalizeKey(value);
  const map: Record<string, Priority> = {
    urgent: "urgent",
    緊急: "urgent",
    high: "high",
    高: "high",
    medium: "medium",
    中: "medium",
    low: "low",
    低: "low",
  };
  return map[key] ?? "medium";
};

const parseCategory = (value: string): Category => {
  const key = normalizeKey(value);
  const map: Record<string, Category> = {
    engineering: "engineering",
    技術開発: "engineering",
    funding: "funding",
    資金調達: "funding",
    external: "external",
    渉外: "external",
    pr: "pr",
    広報: "pr",
    operations: "operations",
    運営: "operations",
  };
  return map[key] ?? "engineering";
};

const safeDate = (value: string, fallback: string) => {
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return date.toISOString().slice(0, 10);
  }
  return fallback;
};

const pendingMemberKey = "soara_pending_member";

const savePendingMember = (value: PendingMember) => {
  try {
    localStorage.setItem(pendingMemberKey, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
};

const loadPendingMember = (): PendingMember | null => {
  try {
    const raw = localStorage.getItem(pendingMemberKey);
    if (!raw) return null;
    return JSON.parse(raw) as PendingMember;
  } catch {
    return null;
  }
};

const clearPendingMember = () => {
  try {
    localStorage.removeItem(pendingMemberKey);
  } catch {
    // ignore storage errors
  }
};

const defaultTaskForm = {
  title: "",
  description: "",
  status: "not_started" as Status,
  priority: "medium" as Priority,
  category: "engineering" as Category,
  assignee: "",
  startDate: "2025-01-10",
  endDate: "2025-01-25",
  budgetPlanned: 0,
  tags: "",
};

const mapTaskRow = (row: any): Task => ({
  id: row.id,
  title: row.title,
  description: row.description,
  status: row.status as Status,
  priority: row.priority as Priority,
  category: row.category as Category,
  assignee: row.assignee,
  startDate: row.start_date,
  endDate: row.end_date,
  progress: row.progress,
  budgetPlanned: row.budget_planned,
  budgetActual: row.budget_actual,
  tags: row.tags ?? [],
});

const mapMemberProfile = (row: any): MemberProfile => ({
  authUserId: row.auth_user_id,
  firstName: row.first_name,
  lastName: row.last_name,
  role: row.role,
  roleLevel: row.role_level,
  school: row.school,
  grade: row.grade,
});

const App = () => {
  const t = i18n;
  const [session, setSession] = useState<Session | null>(null);
  const [memberProfile, setMemberProfile] = useState<MemberProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState(defaultTaskForm);
  const [taskError, setTaskError] = useState("");
  const [authError, setAuthError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [authNotice, setAuthNotice] = useState("");
  const [importNotice, setImportNotice] = useState("");
  const [importing, setImporting] = useState(false);
  const [profileFirstName, setProfileFirstName] = useState("");
  const [profileLastName, setProfileLastName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [view, setView] = useState<ViewKey>("dashboard");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canCreateTask = (memberProfile?.roleLevel ?? 0) >= 2;

  const memberMap = useMemo(() => {
    return new Map(
      members.map((member) => [
        `${normalize(member.lastName)} ${normalize(member.firstName)}`,
        member,
      ])
    );
  }, []);

  useEffect(() => {
    let active = true;
    const init = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!active) return;
      if (error) {
        setAuthError("セッション取得に失敗しました。");
      }
      setSession(data.session ?? null);
      setAuthLoading(false);
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user) {
        setMemberProfile(null);
        return;
      }
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("auth_user_id", session.user.id)
        .maybeSingle();

      if (error) {
        setAuthError(
          `メンバー情報の取得に失敗しました: ${error.message ?? "不明なエラー"}`
        );
        return;
      }

      if (data) {
        setMemberProfile(mapMemberProfile(data));
      }
    };

    loadProfile();
  }, [session]);

  useEffect(() => {
    const ensureProfileFromPending = async () => {
      if (!session?.user || memberProfile) return;
      const pending = loadPendingMember();
      if (!pending) return;
      const member = memberMap.get(
        `${normalize(pending.lastName)} ${normalize(pending.firstName)}`
      );
      if (!member) {
        setAuthError("メンバーが見つかりません。スペルを確認してください。");
        clearPendingMember();
        await supabase.auth.signOut();
        return;
      }
      const profile = await ensureMemberProfile(session.user.id, member, pending.email);
      clearPendingMember();
      if (!profile) return;
    };

    ensureProfileFromPending();
  }, [session, memberProfile, memberMap]);

  useEffect(() => {
    if (!session?.user || memberProfile) return;
    const pending = loadPendingMember();
    setProfileEmail(pending?.email ?? session.user.email ?? "");
    setProfileFirstName(pending?.firstName ?? "");
    setProfileLastName(pending?.lastName ?? "");
  }, [session, memberProfile]);

  useEffect(() => {
    const loadTasks = async () => {
      if (!session?.user) {
        setTasks([]);
        return;
      }
      setTasksLoading(true);
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setTasks(data.map(mapTaskRow));
      }
      setTasksLoading(false);
    };

    loadTasks();
  }, [session]);

  const ensureMemberProfile = async (userId: string, member: Member, emailValue: string) => {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("auth_user_id", userId)
      .maybeSingle();

    if (error) {
      setAuthError(
        `メンバー情報の取得に失敗しました: ${error.message ?? "不明なエラー"}`
      );
      return null;
    }

    if (!data) {
      const { data: nameMatch, error: nameError } = await supabase
        .from("members")
        .select("auth_user_id")
        .eq("first_name", member.firstName)
        .eq("last_name", member.lastName)
        .maybeSingle();

      if (nameError) {
        setAuthError(
          `メンバー情報の取得に失敗しました: ${nameError.message ?? "不明なエラー"}`
        );
        return null;
      }

      if (nameMatch && nameMatch.auth_user_id !== userId) {
        setAuthError("同じ氏名のメンバーは既に登録されています。");
        return null;
      }

      const { data: inserted, error: insertError } = await supabase
        .from("members")
        .insert({
          auth_user_id: userId,
          first_name: member.firstName,
          last_name: member.lastName,
          email: emailValue,
          role: member.role,
          role_level: member.roleLevel,
          school: member.school,
          grade: member.grade,
        })
        .select()
        .single();

      if (insertError || !inserted) {
        if (insertError?.code === "23505") {
          setAuthError("同じ氏名のメンバーは既に登録されています。");
          return null;
        }
        setAuthError("メンバー情報の登録に失敗しました。");
        return null;
      }

      const profile = mapMemberProfile(inserted);
      setMemberProfile(profile);
      return profile;
    }

    const { data: updated } = await supabase
      .from("members")
      .update({
        first_name: member.firstName,
        last_name: member.lastName,
        email: emailValue,
        role: member.role,
        role_level: member.roleLevel,
        school: member.school,
        grade: member.grade,
      })
      .eq("auth_user_id", userId)
      .select()
      .single();

    const profile = mapMemberProfile(updated ?? data);
    setMemberProfile(profile);
    return profile;
  };

  const handleSendOtp = async () => {
    setAuthError("");
    setAuthNotice("");
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setAuthError("氏名とメールアドレスを入力してください。");
      return;
    }
    const member = memberMap.get(`${normalize(lastName)} ${normalize(firstName)}`);
    if (!member) {
      setAuthError("メンバーが見つかりません。スペルを確認してください。");
      return;
    }
    setOtpLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setOtpLoading(false);
    if (error) {
      setAuthError(`ログインリンクの送信に失敗しました: ${error.message ?? "不明なエラー"}`);
      return;
    }
    savePendingMember({ firstName, lastName, email });
    setOtpSent(true);
    setAuthNotice("ログインリンクを送信しました。メールを確認してください。");
  };

  const handleProfileConfirm = async () => {
    setAuthError("");
    if (!session?.user) {
      setAuthError("ログインが必要です。");
      return;
    }
    if (!profileFirstName.trim() || !profileLastName.trim()) {
      setAuthError("氏名を入力してください。");
      return;
    }
    const member = memberMap.get(
      `${normalize(profileLastName)} ${normalize(profileFirstName)}`
    );
    if (!member) {
      setAuthError("メンバーが見つかりません。スペルを確認してください。");
      return;
    }
    setProfileLoading(true);
    const profile = await ensureMemberProfile(
      session.user.id,
      member,
      profileEmail || session.user.email || ""
    );
    setProfileLoading(false);
    if (profile) {
      clearPendingMember();
      setMemberProfile(profile);
      setAuthNotice("");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMemberProfile(null);
    setTasks([]);
  };

  const openTaskModal = () => {
    setTaskError("");
    setTaskForm(defaultTaskForm);
    setShowTaskModal(true);
  };

  const handleImportClick = () => {
    setTaskError("");
    setImportNotice("");
    if (!canCreateTask) {
      setTaskError("タスク作成権限がありません。");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setTaskError("");
    setImportNotice("");
    if (!session?.user) {
      setTaskError("ログインが必要です。");
      return;
    }
    if (!canCreateTask) {
      setTaskError("タスク作成権限がありません。");
      return;
    }
    setImporting(true);
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) {
        setTaskError("Excelシートが見つかりません。");
        return;
      }
      const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, {
        defval: "",
        raw: false,
      });
      if (rows.length === 0) {
        setTaskError("Excelにデータがありません。");
        return;
      }

      const pickField = (row: Record<string, any>, keys: string[]) => {
        for (const key of keys) {
          const value = row[key];
          if (value !== null && value !== undefined && String(value).trim() !== "") {
            return String(value).trim();
          }
        }
        return "";
      };

      const mapped = rows
        .map((row) => {
          const title = pickField(row, ["タイトル", "title", "task"]);
          const assignee = pickField(row, ["担当者", "担当", "assignee"]);
          if (!title || !assignee) return null;
          const description = pickField(row, ["詳細", "説明", "description"]);
          const status = parseStatus(pickField(row, ["ステータス", "status"]));
          const priority = parsePriority(pickField(row, ["優先度", "priority"]));
          const category = parseCategory(pickField(row, ["カテゴリ", "category"]));
          const startDate = safeDate(
            pickField(row, ["開始日", "start_date", "start date"]),
            defaultTaskForm.startDate
          );
          const endDate = safeDate(
            pickField(row, ["終了日", "end_date", "end date"]),
            defaultTaskForm.endDate
          );
          const budgetPlannedRaw = pickField(row, ["予算", "予算予定", "budget", "budget_planned"]);
          const budgetPlanned = Number(budgetPlannedRaw.replace(/[,¥]/g, "")) || 0;
          const tagsRaw = pickField(row, ["タグ", "tags"]);
          const tags = tagsRaw
            ? tagsRaw
                .split(/[,\s]+/)
                .map((tag) => tag.trim())
                .filter(Boolean)
                .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
            : [];

          return {
            title,
            description: description || "詳細なし",
            status,
            priority,
            category,
            assignee,
            start_date: startDate,
            end_date: endDate,
            progress: status === "done" ? 100 : 0,
            budget_planned: budgetPlanned,
            budget_actual: 0,
            tags,
            created_by: session.user.id,
          };
        })
        .filter((row): row is NonNullable<typeof row> => Boolean(row));

      if (mapped.length === 0) {
        setTaskError("タイトルと担当者が入った行がありません。");
        return;
      }

      const { data, error } = await supabase.from("tasks").insert(mapped).select();
      if (error || !data) {
        setTaskError(`Excelインポートに失敗しました: ${error?.message ?? "不明なエラー"}`);
        return;
      }
      setTasks((prev) => [...data.map(mapTaskRow), ...prev]);
      setImportNotice(`Excelから${mapped.length}件を取り込みました。`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "不明なエラー";
      setTaskError(`Excelの読み込みに失敗しました: ${message}`);
    } finally {
      setImporting(false);
      event.target.value = "";
    }
  };

  const handleCreateTask = async () => {
    setTaskError("");
    if (!canCreateTask) {
      setTaskError("タスク作成権限がありません。");
      return;
    }
    if (!taskForm.title.trim() || !taskForm.assignee.trim()) {
      setTaskError("タイトルと担当者は必須です。");
      return;
    }
    if (!session?.user) {
      setTaskError("ログインが必要です。");
      return;
    }

    const tags = taskForm.tags
      .split(/[,\s]+/)
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));

    const payload = {
      title: taskForm.title.trim(),
      description: taskForm.description.trim() || "詳細なし",
      status: taskForm.status,
      priority: taskForm.priority,
      category: taskForm.category,
      assignee: taskForm.assignee,
      start_date: taskForm.startDate,
      end_date: taskForm.endDate,
      progress: taskForm.status === "done" ? 100 : 0,
      budget_planned: Number(taskForm.budgetPlanned) || 0,
      budget_actual: 0,
      tags,
      created_by: session.user.id,
    };

    const { data, error } = await supabase
      .from("tasks")
      .insert(payload)
      .select()
      .single();

    if (error || !data) {
      setTaskError(`タスク作成に失敗しました: ${error?.message ?? "不明なエラー"}`);
      return;
    }

    setTasks((prev) => [mapTaskRow(data), ...prev]);
    setShowTaskModal(false);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      const matchesCategory = categoryFilter === "all" || task.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [tasks, search, statusFilter, priorityFilter, categoryFilter]);

  const totalBudgetPlanned = tasks.reduce((sum, task) => sum + task.budgetPlanned, 0);
  const totalBudgetActual = tasks.reduce((sum, task) => sum + task.budgetActual, 0);
  const completedCount = tasks.filter((task) => task.status === "done").length;
  const atRiskCount = tasks.filter((task) => task.status !== "done" && task.priority === "urgent")
    .length;

  const timelineStart = new Date("2025-01-01");
  const timelineEnd = new Date("2025-03-01");
  const timelineDays = Math.max(
    1,
    Math.ceil((timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24))
  );

  const monthDate = new Date(2025, 0, 1);
  const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  const monthDays = monthEnd.getDate();
  const startWeekday = monthStart.getDay();

  const phaseGroups: Record<string, Task[]> = {
    企画: tasks.filter((task) => task.status === "not_started"),
    設計: tasks.filter((task) => task.category === "engineering" && task.status !== "done"),
    製作: tasks.filter((task) => task.category === "engineering" && task.status === "done"),
    渉外: tasks.filter((task) => task.category === "funding" || task.category === "external"),
    運営: tasks.filter((task) => task.category === "operations" || task.category === "pr"),
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 px-8 py-6 text-subheadline text-gray-600">
          読み込み中...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 bg-soara-100 text-soara-700 px-3 py-1.5 rounded-full text-caption1 font-semibold">
              SOARA メンバーログイン
            </span>
            <h2 className="text-title1 font-bold text-gray-900">ログイン</h2>
            <p className="text-subheadline text-gray-500">
              氏名はローマ字で入力してください。ログインリンクをメールで送信します。
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-subheadline font-medium text-gray-900 mb-2">
                  名（First name）
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl text-body bg-gray-50 border-2 border-transparent focus:border-soara-500 focus:bg-white focus:ring-4 focus:ring-soara-100 transition-all duration-200"
                  placeholder="Taro"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                />
              </div>
              <div>
                <label className="block text-subheadline font-medium text-gray-900 mb-2">
                  姓（Last name）
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl text-body bg-gray-50 border-2 border-transparent focus:border-soara-500 focus:bg-white focus:ring-4 focus:ring-soara-100 transition-all duration-200"
                  placeholder="Yamada"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-subheadline font-medium text-gray-900 mb-2">
                メールアドレス
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl text-body bg-gray-50 border-2 border-transparent focus:border-soara-500 focus:bg-white focus:ring-4 focus:ring-soara-100 transition-all duration-200"
                type="email"
                placeholder="soara@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            {authError && <p className="text-footnote text-red">{authError}</p>}
            {authNotice && <p className="text-footnote text-soara-700">{authNotice}</p>}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="min-h-[44px] w-full sm:w-auto bg-gradient-soara text-white px-6 py-3 rounded-lg text-headline font-semibold shadow-soara hover:shadow-sky transition-all duration-250 ease-apple focus:ring-4 focus:ring-soara-300"
                type="button"
                onClick={handleSendOtp}
                disabled={otpLoading}
              >
                {otpLoading ? "送信中..." : otpSent ? "リンク再送信" : "ログインリンクを送信"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (session && !memberProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 bg-soara-100 text-soara-700 px-3 py-1.5 rounded-full text-caption1 font-semibold">
              SOARA メンバー登録
            </span>
            <h2 className="text-title1 font-bold text-gray-900">プロフィール確認</h2>
            <p className="text-subheadline text-gray-500">
              初回のみ、氏名を入力してメンバー情報を登録してください。
            </p>
          </div>
          <div className="mt-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-subheadline font-medium text-gray-900 mb-2">
                  名（First name）
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl text-body bg-gray-50 border-2 border-transparent focus:border-soara-500 focus:bg-white focus:ring-4 focus:ring-soara-100 transition-all duration-200"
                  value={profileFirstName}
                  onChange={(event) => setProfileFirstName(event.target.value)}
                />
              </div>
              <div>
                <label className="block text-subheadline font-medium text-gray-900 mb-2">
                  姓（Last name）
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl text-body bg-gray-50 border-2 border-transparent focus:border-soara-500 focus:bg-white focus:ring-4 focus:ring-soara-100 transition-all duration-200"
                  value={profileLastName}
                  onChange={(event) => setProfileLastName(event.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-subheadline font-medium text-gray-900 mb-2">
                メールアドレス
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl text-body bg-gray-50 border-2 border-transparent bg-gray-100 text-gray-500"
                value={profileEmail || session.user.email || ""}
                readOnly
              />
            </div>
            {authError && <p className="text-footnote text-red">{authError}</p>}
            <button
              className="min-h-[44px] w-full bg-gradient-soara text-white px-6 py-3 rounded-lg text-headline font-semibold shadow-soara hover:shadow-sky transition-all duration-250 ease-apple focus:ring-4 focus:ring-soara-300"
              type="button"
              onClick={handleProfileConfirm}
              disabled={profileLoading}
            >
              {profileLoading ? "登録中..." : "プロフィールを登録"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-grid-soft opacity-60" aria-hidden="true" />
        <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <nav className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur text-white flex items-center justify-center text-headline font-semibold">
                S
              </div>
              <div>
                <p className="text-caption1 uppercase tracking-wider text-white/70">Soara</p>
                <h1 className="text-title2 sm:text-title1 text-white font-bold">{t.appName}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-caption1 text-white/70">{memberProfile?.role}</p>
                <p className="text-subheadline text-white font-semibold">
                  {memberProfile?.lastName} {memberProfile?.firstName}
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleImportFile}
              />
              <button
                className="min-h-[44px] px-4 sm:px-5 rounded-lg text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-250 ease-apple focus:ring-4 focus:ring-white/30"
                type="button"
                onClick={handleSignOut}
              >
                ログアウト
              </button>
              <button
                className={`min-h-[44px] px-5 sm:px-6 rounded-lg text-headline font-semibold text-white transition-all duration-250 ease-apple focus:ring-4 focus:ring-white/30 ${
                  canCreateTask
                    ? "bg-white/10 border border-white/30 hover:bg-white/20"
                    : "bg-white/5 border border-white/10 text-white/60 cursor-not-allowed"
                }`}
                type="button"
                onClick={handleImportClick}
                disabled={!canCreateTask || importing}
              >
                {importing ? "取込中..." : "Excelインポート"}
              </button>
              <button
                className={`min-h-[44px] px-5 sm:px-6 rounded-lg text-headline font-semibold text-white transition-all duration-250 ease-apple focus:ring-4 focus:ring-soara-300 ${
                  canCreateTask
                    ? "bg-gradient-soara shadow-soara hover:shadow-sky"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                type="button"
                onClick={openTaskModal}
                disabled={!canCreateTask}
              >
                {t.ctaPrimary}
              </button>
            </div>
          </nav>

          <div className="mt-10 sm:mt-14 grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 text-white px-3 py-1.5 rounded-full text-caption1 font-semibold uppercase tracking-wider">
                {t.teamTag}
              </div>
              <h2 className="text-title1 sm:text-largeTitle lg:text-[44px] font-bold text-white mt-5 leading-tight">
                高校生チームの進行を一括管理
              </h2>
              <p className="text-callout sm:text-body text-white/85 mt-4 max-w-2xl">
                技術開発、資金調達、渉外、運営まで。リアルタイムで進捗を見える化します。
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  className={`min-h-[44px] px-6 py-3 rounded-lg text-headline font-semibold text-white transition-all duration-250 ease-apple focus:ring-4 focus:ring-soara-300 ${
                    canCreateTask
                      ? "bg-gradient-soara shadow-soara hover:shadow-sky"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  type="button"
                  onClick={openTaskModal}
                  disabled={!canCreateTask}
                >
                  {t.ctaPrimary}
                </button>
                <button
                  className="min-h-[44px] px-6 py-3 rounded-lg text-headline font-semibold text-white bg-white/10 border border-white/30 hover:bg-white/20 transition-all duration-250 ease-apple focus:ring-4 focus:ring-white/30"
                  type="button"
                >
                  {t.ctaSecondary}
                </button>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/10">
              <div className="flex items-center justify-between">
                <p className="text-caption1 text-white/70 uppercase tracking-wider">{t.milestones}</p>
                <span className="text-caption1 text-white/70">2025-2026</span>
              </div>
              <div className="mt-4 space-y-3">
                {milestones.map((milestone) => (
                  <div key={milestone.date} className="flex items-center justify-between text-white">
                    <span className="text-subheadline font-medium">{milestone.label}</span>
                    <span className="text-footnote text-white/80">{formatDate(milestone.date)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-white/20 rounded-2xl p-4">
                <p className="text-caption1 uppercase tracking-wider text-white/70">{t.alerts}</p>
                <ul className="mt-3 space-y-2 text-white/90 text-subheadline">
                  <li>CFD検証レビューの期限が近づいています。</li>
                  <li>予算見通しがスポンサー回答待ちです。</li>
                  <li>施設連携の打合せを調整中です。</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label={t.kpis.total} value={String(tasks.length)} trend="今月 +12%" />
            <KpiCard
              label={t.kpis.completed}
              value={`${completedCount}/${tasks.length}`}
              trend="今月 +1"
            />
            <KpiCard label={t.kpis.atRisk} value={String(atRiskCount)} trend="今月 -2" />
            <KpiCard
              label={t.kpis.budget}
              value={`${Math.round((totalBudgetActual / Math.max(1, totalBudgetPlanned)) * 100)}%`}
              trend={formatJPY(totalBudgetActual)}
            />
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-8">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {views.map((key) => (
                <button
                  key={key}
                  className={`min-h-[44px] px-4 rounded-lg text-subheadline font-semibold transition-all duration-200 focus:ring-4 focus:ring-soara-300 ${
                    view === key
                      ? "bg-gradient-soara text-white shadow-soara"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setView(key)}
                  type="button"
                >
                  {t.nav[key]}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                className="min-h-[44px] w-full sm:w-56 rounded-xl bg-gray-50 border-2 border-transparent px-4 text-subheadline focus:border-soara-500 focus:bg-white focus:ring-4 focus:ring-soara-100 transition-all duration-200"
                placeholder={t.filters.search}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <select
                className="min-h-[44px] rounded-xl bg-gray-50 border-2 border-transparent px-3 text-subheadline focus:border-soara-500 focus:bg-white focus:ring-4 focus:ring-soara-100 transition-all duration-200"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as Status | "all")}
              >
                <option value="all">{t.filters.status}</option>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                className="min-h-[44px] rounded-xl bg-gray-50 border-2 border-transparent px-3 text-subheadline focus:border-soara-500 focus:bg-white focus:ring-4 focus:ring-soara-100 transition-all duration-200"
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value as Priority | "all")}
              >
                <option value="all">{t.filters.priority}</option>
                {Object.entries(priorityLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                className="min-h-[44px] rounded-xl bg-gray-50 border-2 border-transparent px-3 text-subheadline focus:border-soara-500 focus:bg-white focus:ring-4 focus:ring-soara-100 transition-all duration-200"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value as Category | "all")}
              >
                <option value="all">{t.filters.category}</option>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <button
                className="min-h-[44px] px-4 rounded-xl bg-gray-100 text-gray-900 font-semibold hover:bg-gray-200 transition-colors duration-200"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                  setCategoryFilter("all");
                }}
                type="button"
              >
                {t.filters.reset}
              </button>
            </div>
          </div>
        </div>
        {taskError && (
          <div className="mb-6 rounded-2xl border border-red/20 bg-red/5 px-4 py-3 text-subheadline text-red">
            {taskError}
          </div>
        )}
        {importNotice && (
          <div className="mb-6 rounded-2xl border border-soara-200 bg-soara-50 px-4 py-3 text-subheadline text-soara-700">
            {importNotice}
          </div>
        )}
        {view === "dashboard" && (
          <section className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card>
                <CardTitle>進行中タスク</CardTitle>
                <div className="mt-4 space-y-4">
                  {filteredTasks.slice(0, 4).map((task) => (
                    <TaskRow key={task.id} task={task} />
                  ))}
                  {filteredTasks.length === 0 && (
                    <p className="text-subheadline text-gray-500">{t.empty}</p>
                  )}
                </div>
              </Card>
              <Card>
                <CardTitle>予算スナップショット</CardTitle>
                <div className="mt-4">
                  <p className="text-title2 font-bold text-gray-900">{formatJPY(totalBudgetActual)}</p>
                  <p className="text-subheadline text-gray-500 mt-1">
                    予定 {formatJPY(totalBudgetPlanned)}
                  </p>
                  <div className="mt-4 h-3 rounded-full bg-gray-100">
                    <div
                      className="h-3 rounded-full bg-gradient-soara"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((totalBudgetActual / Math.max(1, totalBudgetPlanned)) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </Card>
              <Card>
                <CardTitle>メンバー稼働</CardTitle>
                <div className="mt-4 space-y-3">
                  {members.slice(0, 4).map((member, index) => (
                    <div key={member.lastName} className="flex items-center justify-between">
                      <span className="text-subheadline text-gray-600">{member.lastName}</span>
                      <span className="text-subheadline text-gray-900 font-semibold">
                        {6 - index} 件
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
              <Card>
                <CardTitle>{t.listHeading}</CardTitle>
                <div className="mt-4 space-y-3">
                  {filteredTasks.length === 0 && (
                    <p className="text-subheadline text-gray-500">{t.empty}</p>
                  )}
                  {filteredTasks.slice(0, 6).map((task) => (
                    <TaskRow key={task.id} task={task} />
                  ))}
                </div>
              </Card>
              <Card>
                <CardTitle>{t.milestones}</CardTitle>
                <div className="mt-4 space-y-4">
                  {milestones.map((milestone) => (
                    <div key={milestone.date} className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-soara-100 text-soara-700 flex items-center justify-center font-semibold">
                        ✓
                      </div>
                      <div className="flex-1">
                        <p className="text-subheadline font-semibold text-gray-900">
                          {milestone.label}
                        </p>
                        <p className="text-footnote text-gray-500">{formatDate(milestone.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </section>
        )}

        {view === "list" && (
          <section className="space-y-6">
            <h3 className="text-title2 font-bold text-gray-900">{t.listHeading}</h3>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-x-auto">
              <div className="min-w-[720px]">
                <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 px-6 py-4 bg-gray-50 text-subheadline text-gray-500">
                  <span>タスク</span>
                  <span>担当</span>
                  <span>期間</span>
                  <span>状態</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {filteredTasks.length === 0 && (
                    <p className="px-6 py-4 text-subheadline text-gray-500">{t.empty}</p>
                  )}
                  {filteredTasks.map((task) => (
                    <div key={task.id} className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 px-6 py-4">
                      <div>
                        <p className="text-subheadline font-semibold text-gray-900">{task.title}</p>
                        <p className="text-footnote text-gray-500">{task.description}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {task.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center bg-soara-100 text-soara-700 px-2.5 py-1 rounded-full text-caption1 font-semibold"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-subheadline text-gray-600">{task.assignee}</div>
                      <div className="text-subheadline text-gray-600">
                        {formatDate(task.startDate)} - {formatDate(task.endDate)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-caption1 font-semibold ${
                            badgeTone[task.status]
                          }`}
                        >
                          {statusLabels[task.status]}
                        </span>
                        <span className={`text-caption1 font-semibold ${priorityTone[task.priority]}`}>
                          {priorityLabels[task.priority]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {view === "kanban" && (
          <section className="space-y-6">
            <h3 className="text-title2 font-bold text-gray-900">{t.kanbanHeading}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Object.entries(statusLabels).map(([statusKey, label]) => (
                <div
                  key={statusKey}
                  className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-subheadline font-semibold text-gray-900">{label}</p>
                    <span className="text-footnote text-gray-500">
                      {tasks.filter((task) => task.status === statusKey).length}
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {tasks
                      .filter((task) => task.status === statusKey)
                      .map((task) => (
                        <div
                          key={task.id}
                          className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <p className="text-subheadline font-semibold text-gray-900">{task.title}</p>
                          <p className="text-footnote text-gray-500 mt-1">{task.assignee}</p>
                          <div className="mt-3 flex items-center justify-between">
                            <span className={`text-caption1 font-semibold ${priorityTone[task.priority]}`}>
                              {priorityLabels[task.priority]}
                            </span>
                            <span className="text-caption1 text-gray-400">
                              {formatDate(task.endDate)}
                            </span>
                          </div>
                        </div>
                      ))}
                    {tasks.filter((task) => task.status === statusKey).length === 0 && (
                      <p className="text-subheadline text-gray-500">{t.empty}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {view === "gantt" && (
          <section className="space-y-6">
            <h3 className="text-title2 font-bold text-gray-900">{t.ganttHeading}</h3>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 overflow-x-auto">
              <div className="min-w-[720px] space-y-4">
                <div className="grid grid-cols-[200px_1fr] gap-4 text-footnote text-gray-500">
                  <div>タスク</div>
                  <div className="grid grid-cols-8 gap-2">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div key={index} className="text-center">
                        W{index + 1}
                      </div>
                    ))}
                  </div>
                </div>
                {filteredTasks.map((task) => {
                  const start = new Date(task.startDate);
                  const end = new Date(task.endDate);
                  const offset = Math.max(
                    1,
                    Math.ceil((start.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24))
                  );
                  const span = Math.max(
                    1,
                    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
                  );
                  const left = Math.min(100, (offset / timelineDays) * 100);
                  const width = Math.max(6, (span / timelineDays) * 100);

                  return (
                    <div key={task.id} className="grid grid-cols-[200px_1fr] gap-4 items-center">
                      <div>
                        <p className="text-subheadline font-semibold text-gray-900">{task.title}</p>
                        <p className="text-footnote text-gray-500">
                          {formatDate(task.startDate)} - {formatDate(task.endDate)}
                        </p>
                      </div>
                      <div className="relative h-10 bg-gray-50 rounded-2xl overflow-hidden">
                        <div
                          className="absolute h-full bg-gradient-soara rounded-2xl shadow-soara flex items-center px-3 text-white text-caption1 font-semibold"
                          style={{ left: `${left}%`, width: `${width}%` }}
                        >
                          {task.progress}%
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredTasks.length === 0 && (
                  <p className="text-subheadline text-gray-500">{t.empty}</p>
                )}
              </div>
            </div>
          </section>
        )}

        {view === "calendar" && (
          <section className="space-y-6">
            <h3 className="text-title2 font-bold text-gray-900">{t.calendarHeading}</h3>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <div className="grid grid-cols-7 gap-3 text-footnote text-gray-500">
                {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
                  <div key={day} className="text-center">
                    {day}
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-7 gap-3">
                {Array.from({ length: startWeekday }).map((_, index) => (
                  <div key={`empty-${index}`} className="h-24" />
                ))}
                {Array.from({ length: monthDays }).map((_, index) => {
                  const day = index + 1;
                  const dateStr = `2025-01-${String(day).padStart(2, "0")}`;
                  const dayTasks = tasks.filter(
                    (task) => task.startDate <= dateStr && task.endDate >= dateStr
                  );

                  return (
                    <div
                      key={dateStr}
                      className="h-24 rounded-2xl border border-gray-100 p-2 bg-gray-50"
                    >
                      <p className="text-caption1 text-gray-500">{day}</p>
                      <div className="mt-1 space-y-1">
                        {dayTasks.slice(0, 2).map((task) => (
                          <div
                            key={task.id}
                            className="text-[10px] rounded-full bg-soara-100 text-soara-700 px-2 py-0.5 font-semibold truncate"
                          >
                            {task.title}
                          </div>
                        ))}
                        {dayTasks.length > 2 && (
                          <p className="text-[10px] text-gray-400">+{dayTasks.length - 2}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {view === "timeline" && (
          <section className="space-y-6">
            <h3 className="text-title2 font-bold text-gray-900">{t.timelineHeading}</h3>
            <div className="space-y-6">
              {Object.entries(phaseGroups).map(([phase, phaseTasks]) => (
                <div key={phase} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-headline font-semibold text-gray-900">{phase}</h4>
                    <span className="text-caption1 text-gray-500">{phaseTasks.length} 件</span>
                  </div>
                  <div className="mt-4 grid md:grid-cols-2 gap-4">
                    {phaseTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <p className="text-subheadline font-semibold text-gray-900">{task.title}</p>
                        <p className="text-footnote text-gray-500 mt-1">{task.description}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-caption1 font-semibold ${
                              badgeTone[task.status]
                            }`}
                          >
                            {statusLabels[task.status]}
                          </span>
                          <span className="text-caption1 text-gray-400">{formatDate(task.endDate)}</span>
                        </div>
                      </div>
                    ))}
                    {phaseTasks.length === 0 && (
                      <p className="text-subheadline text-gray-500">{t.empty}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tasksLoading && (
          <div className="mt-6 text-subheadline text-gray-500">タスクを読み込み中...</div>
        )}
      </main>

      {showTaskModal && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => setShowTaskModal(false)}
          />
          <div className="relative z-10 flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
            <div
              className="w-full max-w-3xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="task-modal-title"
            >
              <div className="flex justify-center pt-3 pb-2 sm:hidden">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 id="task-modal-title" className="text-title2 font-bold text-gray-900">
                  {t.ctaPrimary}
                </h2>
                <button
                  className="w-11 h-11 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  aria-label="閉じる"
                >
                  ×
                </button>
              </div>
              <div className="px-6 py-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-subheadline font-medium text-gray-900 mb-2">
                      タイトル
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-xl text-body bg-gray-50 border-2 border-transparent focus:border-soara-500 focus:bg-white focus:ring-4 focus:ring-soara-100 transition-all duration-200"
                      value={taskForm.title}
                      onChange={(event) =>
                        setTaskForm((prev) => ({ ...prev, title: event.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-subheadline font-medium text-gray-900 mb-2">
                      担当者
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-xl text-body bg-gray-50 border-2 border-transparent focus:border-soara-500 focus:bg-white focus:ring-4 focus:ring-soara-100 transition-all duration-200"
                      value={taskForm.assignee}
                      onChange={(event) =>
                        setTaskForm((prev) => ({ ...prev, assignee: event.target.value }))
                      }
                    >
                      <option value="">選択してください</option>
                      {members.map((member) => (
                        <option
                          key={`${member.firstName}-${member.lastName}`}
                          value={`${member.firstName} ${member.lastName}`}
                        >
                          {member.firstName} {member.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-subheadline font-medium text-gray-900 mb-2">
                    詳細
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl text-body bg-gray-50 border-2 border-transparent focus:border-soara-500 focus:bg-white focus:ring-4 focus:ring-soara-100 transition-all duration-200 resize-none"
                    value={taskForm.description}
                    onChange={(event) =>
                      setTaskForm((prev) => ({ ...prev, description: event.target.value }))
                    }
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-subheadline font-medium text-gray-900 mb-2">
                      ステータス
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-xl text-body bg-gray-50 border-2 border-transparent focus:border-soara-500 focus:bg-white focus:ring-4 focus:ring-soara-100 transition-all duration-200"
                      value={taskForm.status}
                      onChange={(event) =>
                        setTaskForm((prev) => ({
                          ...prev,
                          status: event.target.value as Status,
                        }))
                      }
                    >
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-subheadline font-medium text-gray-900 mb-2">
                      優先度
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-xl text-body bg-gray-50 border-2 border-transparent focus:border-soara-500 focus:bg-white focus:ring-4 focus:ring-soara-100 transition-all duration-200"
                      value={taskForm.priority}
                      onChange={(event) =>
                        setTaskForm((prev) => ({
                          ...prev,
                          priority: event.target.value as Priority,
                        }))
                      }
                    >
                      {Object.entries(priorityLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-subheadline font-medium text-gray-900 mb-2">
                      カテゴリ
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-xl text-body bg-gray-50 border-2 border-transparent focus:border-soara-500 focus:bg-white focus:ring-4 focus:ring-soara-100 transition-all duration-200"
                      value={taskForm.category}
                      onChange={(event) =>
                        setTaskForm((prev) => ({
                          ...prev,
                          category: event.target.value as Category,
                        }))
                      }
                    >
                      {Object.entries(categoryLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-subheadline font-medium text-gray-900 mb-2">
                      開始日
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 rounded-xl text-body bg-gray-50 border-2 border-transparent focus:border-soara-500 focus:bg-white focus:ring-4 focus:ring-soara-100 transition-all duration-200"
                      value={taskForm.startDate}
                      onChange={(event) =>
                        setTaskForm((prev) => ({ ...prev, startDate: event.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-subheadline font-medium text-gray-900 mb-2">
                      終了日
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 rounded-xl text-body bg-gray-50 border-2 border-transparent focus:border-soara-500 focus:bg-white focus:ring-4 focus:ring-soara-100 transition-all duration-200"
                      value={taskForm.endDate}
                      onChange={(event) =>
                        setTaskForm((prev) => ({ ...prev, endDate: event.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-subheadline font-medium text-gray-900 mb-2">
                      予算（予定・円）
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 rounded-xl text-body bg-gray-50 border-2 border-transparent focus:border-soara-500 focus:bg-white focus:ring-4 focus:ring-soara-100 transition-all duration-200"
                      value={taskForm.budgetPlanned}
                      onChange={(event) =>
                        setTaskForm((prev) => ({
                          ...prev,
                          budgetPlanned: Number(event.target.value || 0),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-subheadline font-medium text-gray-900 mb-2">
                      タグ
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-xl text-body bg-gray-50 border-2 border-transparent focus:border-soara-500 focus:bg-white focus:ring-4 focus:ring-soara-100 transition-all duration-200"
                      placeholder="#design #sponsor"
                      value={taskForm.tags}
                      onChange={(event) =>
                        setTaskForm((prev) => ({ ...prev, tags: event.target.value }))
                      }
                    />
                  </div>
                </div>
                {taskError && <p className="text-footnote text-red">{taskError}</p>}
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
                <button
                  className="min-h-[44px] px-5 py-3 rounded-lg bg-gray-100 text-gray-900 font-semibold hover:bg-gray-200 transition-colors duration-200"
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                >
                  キャンセル
                </button>
                <button
                  className="min-h-[44px] px-6 py-3 rounded-lg bg-gradient-soara text-white font-semibold shadow-soara hover:shadow-sky transition-all duration-250 ease-apple"
                  type="button"
                  onClick={handleCreateTask}
                >
                  作成
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Card = ({ children }: { children: ReactNode }) => (
  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">{children}</div>
);

const CardTitle = ({ children }: { children: ReactNode }) => (
  <h3 className="text-headline font-semibold text-gray-900">{children}</h3>
);

const KpiCard = ({ label, value, trend }: { label: string; value: string; trend: string }) => (
  <div className="bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 p-4">
    <p className="text-caption1 uppercase tracking-wider text-white/70">{label}</p>
    <p className="text-title2 font-bold text-white mt-2">{value}</p>
    <p className="text-footnote text-white/80 mt-1">{trend}</p>
  </div>
);

const TaskRow = ({ task }: { task: Task }) => (
  <div className="flex items-center justify-between gap-3">
    <div>
      <p className="text-subheadline font-semibold text-gray-900">{task.title}</p>
      <p className="text-footnote text-gray-500">
        {categoryLabels[task.category]} / {task.assignee}
      </p>
    </div>
    <div className="text-right">
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-caption1 font-semibold ${
          badgeTone[task.status]
        }`}
      >
        {statusLabels[task.status]}
      </span>
      <p className="text-footnote text-gray-500 mt-1">{formatDate(task.endDate)}</p>
    </div>
  </div>
);

export default App;
