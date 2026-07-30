export function inferMimeType(fileName: string): string {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (extension === "png") {
        return "image/png";
    }
    if (extension === "webp") {
        return "image/webp";
    }
    return "image/jpeg";
}
