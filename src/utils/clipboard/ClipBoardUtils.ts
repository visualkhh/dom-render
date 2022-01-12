export class ClipBoardUtils {
    static readText(clipboard: Clipboard = navigator.clipboard): Promise<string> {
        return clipboard.readText();
    }

    static read(clipboard: Clipboard = navigator.clipboard): Promise<ClipboardItems> {
        return clipboard.read();
    }

    static writeText(data: string, clipboard: Clipboard = navigator.clipboard): Promise<void> {
        return clipboard.writeText(data);
    }

    static write(data: ClipboardItems, clipboard: Clipboard = navigator.clipboard): Promise<void> {
        return clipboard.write(data);
    }
}