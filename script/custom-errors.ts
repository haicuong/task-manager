import { Table } from "./initial-table";

export class MyError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class DataNotFoundError extends MyError {}
export class TableLoadError extends MyError {}
export class FormNotFoundError extends MyError {}
export class TaskNotFoundError extends MyError {
  table: Table | undefined;
  UUID: string | undefined;
  constructor(message: string, table?: Table, UUID?: string) {
    super(message);
    if (table) this.table = table;
    if (UUID) this.UUID = UUID;
  }
}
export class TbodyTagNotMatchError extends MyError {}
