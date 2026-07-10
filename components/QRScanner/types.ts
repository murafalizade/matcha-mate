export interface QRScannerProps {
    onScan?: (data: string) => void;
    onCancel?: () => void;
}
