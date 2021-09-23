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

    // public static betweenReplace(start: string, end: string, message: string, replace: string) {
    //     const regex = RegExp('([^(dr\\-)])?this(?=.?)', 'gm');
    //     StringUtils.regexExec(regex, message).reverse().forEach(it => {
    //         message = message.substr(0, it.index) + message.substr(it.index).replace(it[0], `${it[1] ?? ''}${drThis}`);
    //     })
    // }
}
