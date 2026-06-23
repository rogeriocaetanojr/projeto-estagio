export interface UploadLimitStrategy {
  getLimitInBytes(): number;
}
