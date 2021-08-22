export class StringUtils {
    public static deleteEnter(data: string) {
        return data.replace(/\r?\n/g, '')
    }

    public static regexExec(regex: RegExp, text: string) {
        let varExec = regex.exec(text)
        const usingVars = [];
        while (varExec) {
            usingVars.push(varExec)
            varExec = regex.exec(varExec.input)
        }
        return usingVars;
    }
}
