export enum AppearanceColor {
    Default = 'default-notification-overlay',
    Info = 'info-notification-overlay',
    Success = 'success-notification-overlay',
    Warn = 'warning-notification-overlay',
    Error = 'error-notification-overlay'
}

export interface SnackBar {
    message: string;
    panelClass: AppearanceColor;
}
