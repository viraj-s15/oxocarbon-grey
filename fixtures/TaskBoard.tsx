// A small task board component, used for theme previews.
import { useEffect, useMemo, useState, type ReactNode } from "react";
import * as api from "./api";
import type { User } from "./types";
export { formatDate } from "./format";

export enum Priority {
  Low = 1,
  Medium,
  High,
}

export interface Task {
  readonly id: string;
  title: string;
  done: boolean;
  priority: Priority;
  assignee?: User | null;
  tags: readonly string[];
}

type Filter = "all" | "open" | "done";
type Grouped<T extends { priority: Priority }> = Record<Priority, T[]>;

const MAX_TASKS = 250;
const defaults = { filter: "all", pageSize: 20 } satisfies { filter: Filter; pageSize: number };

function sealed(constructor: Function): void {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
export class TaskStore {
  static readonly version = "1.2.0";
  private tasks = new Map<string, Task>();

  constructor(private readonly userId: string) {}

  add(task: Task): this {
    if (this.tasks.size >= MAX_TASKS) {
      throw new RangeError(`store is full (${MAX_TASKS} tasks)`);
    }
    this.tasks.set(task.id, task);
    return this;
  }

  groupBy<T extends Task>(items: T[]): Grouped<T> {
    return items.reduce((acc, item) => {
      (acc[item.priority] ??= []).push(item);
      return acc;
    }, {} as Grouped<T>);
  }

  async sync(signal?: AbortSignal): Promise<number> {
    const response = await fetch(`/api/users/${this.userId}/tasks`, { signal });
    const body = (await response.json()) as Task[];
    body.forEach((t) => this.add(t));
    return body.length;
  }
}

export function filterTasks(tasks: Task[], filter: Filter = "all"): Task[] {
  switch (filter) {
    case "open":
      return tasks.filter((t) => !t.done);
    case "done":
      return tasks.filter((t) => t.done);
    default:
      return tasks;
  }
}

interface BadgeProps {
  priority: Priority;
  children?: ReactNode;
}

const Badge = ({ priority, children }: BadgeProps) => (
  <span className={`badge badge-${Priority[priority].toLowerCase()}`} aria-label="priority">
    {children ?? Priority[priority]}
  </span>
);

export default function TaskBoard({ store, user }: { store: TaskStore; user?: User }) {
  const [filter, setFilter] = useState<Filter>(defaults.filter);
  const [error, setError] = useState<Error | null>(null);
  const visible = useMemo(() => filterTasks([...api.cached()], filter), [filter]);
  const pattern = /^task-(\d+)$/i;

  useEffect(() => {
    const controller = new AbortController();
    store.sync(controller.signal).catch((e: unknown) => setError(e instanceof Error ? e : null));
    return () => controller.abort();
  }, [store]);

  if (error !== null) {
    console.error("sync failed", error.message);
    return <p className="error">Could not load tasks: {error.message}</p>;
  }

  return (
    <section className="board" data-user={user?.name ?? "guest"}>
      <h2>Tasks for {user?.name.toUpperCase() ?? "you"}</h2>
      <select value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
        <option value="all">All</option>
        <option value="open">Open</option>
      </select>
      <ul>
        {visible.map((task) => (
          <li key={task.id} className={task.done ? "done" : undefined}>
            <Badge priority={task.priority} />
            {task.title} {pattern.test(task.id) && <em>#{task.id.slice(5)}</em>}
          </li>
        ))}
      </ul>
      <footer>{Promise.name} {Array.isArray(visible) ? visible.length : 0} / {MAX_TASKS}</footer>
    </section>
  );
}
