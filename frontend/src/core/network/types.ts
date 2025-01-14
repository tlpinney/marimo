/* Copyright 2024 Marimo. All rights reserved. */
import type { AppConfig, UserConfig } from "../config/config-schema";
import type { LayoutType } from "@/components/editor/renderers/types";
import type { CellId } from "../cells/ids";
import type { CellConfig } from "../cells/types";
import type { RequestId } from "./DeferredRequestRegistry";
import type { FilePath } from "@/utils/paths";
import type { PackageManagerName } from "../config/config-schema";
import type { SessionId } from "@/core/kernel/session";
import { VariableName } from "../variables/types";

// Ideally this would be generated from server.py, but for now we just
// manually keep them in sync.

export interface DeleteRequest {
  cellId: CellId;
}

export interface InstantiateRequest {
  objectIds: string[];
  values: unknown[];
}

export interface FormatRequest {
  /**
   * mapping of cell ids to code
   */
  codes: Record<CellId, string>;
  /**
   * line-length
   */
  lineLength: number;
}

export interface FormatResponse {
  /**
   * mapping of formatted cell ids to code
   * response keys are a subset of request keys
   */
  codes: Record<CellId, string>;
}

export interface RenameRequest {
  filename: string | null;
}

export interface RunRequest {
  cellIds: CellId[];
  codes: string[];
}

export interface SaveKernelRequest {
  cellIds: CellId[];
  filename: string;
  codes: string[];
  names: string[];
  layout:
    | {
        type: LayoutType;
        data: unknown;
      }
    | undefined;
  configs: CellConfig[];
}

export interface SetComponentValuesRequest {
  objectIds: string[];
  values: unknown[];
}

export interface CodeCompletionRequest {
  id: RequestId;
  document: string;
  cellId: CellId;
}

export interface SaveUserConfigRequest {
  config: UserConfig;
}

export interface SaveAppConfigRequest {
  config: AppConfig;
}

export interface SaveCellConfigRequest {
  configs: Record<CellId, CellConfig>;
}

export interface SendFunctionRequest {
  functionCallId: RequestId;
  args: unknown;
  namespace: string;
  functionName: string;
}

export interface SendStdin {
  text: string;
}

// In the future may include things like package manager, index URL, ...
export interface SendInstallMissingPackages {
  manager: PackageManagerName;
}

export interface ValueUpdate {
  objectId: string;
  value: unknown;
}

export interface FileInfo {
  id: string;
  path: FilePath;
  name: string;
  lastModified?: number;
  isDirectory: boolean;
  isMarimoFile: boolean;
  children: FileInfo[];
}

export interface FileListRequest {
  path: FilePath | undefined;
}

export interface FileListResponse {
  files: FileInfo[];
  root: FilePath;
}

export interface FileCreateRequest {
  path: FilePath;
  type: "file" | "directory";
  name: string;
  // base64 representation of contents
  contents: string | undefined;
}

export interface FileDeleteRequest {
  path: FilePath;
}

export interface FileMoveRequest {
  path: FilePath;
  newPath: FilePath;
}

export interface FileUpdateRequest {
  path: FilePath;
  contents: string;
}

export interface FileOperationResponse {
  success: boolean;
  message: string | undefined;
  info: FileInfo | undefined;
}

export interface FileDetailsResponse {
  file: FileInfo;
  mimeType: string | undefined;
  contents: string | undefined;
}

export interface Snippet {
  title: string;
  sections: Array<{
    id: string;
    html?: string;
    code?: string;
  }>;
}

export interface SnippetsResponse {
  snippets: Snippet[];
}

export interface PreviewDatasetColumnRequest {
  source: string;
  tableName: string;
  columnName: string;
}

export interface DataTableColumn {
  name: string;
  type: "string" | "boolean" | "integer" | "number" | "date" | "unknown";
}

export interface DataTable {
  name: string;
  source: string;
  /**
   * The variable name if this is a variable in the notebook.
   */
  variable_name: VariableName | null;
  num_rows: number;
  num_columns: number;
  columns: DataTableColumn[];
}

interface MarimoNotebook {
  name: string;
  path: string;
  lastModified?: number;
  sessionId?: SessionId;
  initializationId?: string;
}

export interface RecentFilesResponse {
  files: MarimoNotebook[];
}

export interface WorkspaceFilesRequest {
  includeMarkdown: boolean;
}

export interface WorkspaceFilesResponse {
  files: MarimoNotebook[];
}

export interface RunningNotebooksResponse {
  files: MarimoNotebook[];
}

export interface ShutdownSessionRequest {
  sessionId: SessionId;
}

export interface ExportAsHTMLRequest {
  assetUrl?: string;
  includeCode: boolean;
  files: string[];
  download: boolean;
}

export interface ExportAsMarkdownRequest {
  download: boolean;
}

export interface UsageResponse {
  memory: {
    total: number;
    available: number;
    percent: number;
    used: number;
    free: number;
  };
  cpu: {
    percent: number;
  };
}

/**
 * Requests sent to the BE during run/edit mode.
 */
export interface RunRequests {
  sendComponentValues: (valueUpdates: ValueUpdate[]) => Promise<null>;
  sendInstantiate: (request: InstantiateRequest) => Promise<null>;
  sendFunctionRequest: (request: SendFunctionRequest) => Promise<null>;
}

/**
 * Requests sent to the BE during edit mode.
 */
export interface EditRequests {
  sendRename: (filename: string | null) => Promise<null>;
  sendSave: (request: SaveKernelRequest) => Promise<null>;
  sendStdin: (request: SendStdin) => Promise<null>;
  sendRun: (cellIds: CellId[], codes: string[]) => Promise<null>;
  sendInterrupt: () => Promise<null>;
  sendShutdown: () => Promise<null>;
  sendFormat: (request: FormatRequest) => Promise<Record<CellId, string>>;
  sendDeleteCell: (cellId: CellId) => Promise<null>;
  sendCodeCompletionRequest: (request: CodeCompletionRequest) => Promise<null>;
  saveUserConfig: (request: SaveUserConfigRequest) => Promise<null>;
  saveAppConfig: (request: SaveAppConfigRequest) => Promise<null>;
  saveCellConfig: (request: SaveCellConfigRequest) => Promise<null>;
  sendRestart: () => Promise<null>;
  sendInstallMissingPackages: (
    request: SendInstallMissingPackages,
  ) => Promise<null>;
  readCode: () => Promise<{ contents: string }>;
  readSnippets: () => Promise<SnippetsResponse>;
  previewDatasetColumn: (request: PreviewDatasetColumnRequest) => Promise<null>;
  openFile: (request: { path: string }) => Promise<null>;
  getUsageStats: () => Promise<UsageResponse>;
  // File explorer requests
  sendListFiles: (request: FileListRequest) => Promise<FileListResponse>;
  sendCreateFileOrFolder: (
    request: FileCreateRequest,
  ) => Promise<FileOperationResponse>;
  sendDeleteFileOrFolder: (
    request: FileDeleteRequest,
  ) => Promise<FileOperationResponse>;
  sendRenameFileOrFolder: (
    request: FileMoveRequest,
  ) => Promise<FileOperationResponse>;
  sendUpdateFile: (
    request: FileUpdateRequest,
  ) => Promise<FileOperationResponse>;
  sendFileDetails: (request: { path: string }) => Promise<FileDetailsResponse>;
  // Homepage requests
  getRecentFiles: () => Promise<RecentFilesResponse>;
  getWorkspaceFiles: (
    request: WorkspaceFilesRequest,
  ) => Promise<WorkspaceFilesResponse>;
  getRunningNotebooks: () => Promise<RunningNotebooksResponse>;
  shutdownSession: (
    request: ShutdownSessionRequest,
  ) => Promise<RunningNotebooksResponse>;
  exportAsHTML: (request: ExportAsHTMLRequest) => Promise<string>;
  exportAsMarkdown: (request: ExportAsMarkdownRequest) => Promise<string>;
}

export type RequestKey = keyof (EditRequests & RunRequests);
