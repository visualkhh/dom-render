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

  public static regexExecArrayReplace(origin: string, regexpExecArrayOrRegex: RegExpExecArray[] | RegExp, replace: string | ((data: RegExpExecArray) => string)) {
    const regexpExecArrays = Array.isArray(regexpExecArrayOrRegex) ? regexpExecArrayOrRegex : StringUtils.regexExec(regexpExecArrayOrRegex, origin);
    regexpExecArrays.reverse().forEach(it => {
      const r = typeof replace === 'string' ? replace : replace(it);
      origin = origin.substr(0, it.index) + origin.substr(it.index).replace(it[0], r);
    })
    return origin;
  }
  // public static regexGroups(regex: RegExp, text: string) {
  //   const usingVars = [];
  //   let varExec = regex.exec(text)
  //   while (varExec) {
  //     usingVars.push(varExec)
  //     varExec = regex.exec(varExec.input)
  //   }
  //   return usingVars;
  // }



  // public static betweenRegexpStr(start: string, end: string, data: string, flag = 'gm') {
  //     const startEspace = StringUtils.escapeSpecialCharacterRegExp(start);
  //     const reg = RegExp(`(${start}(?:(${start})??[^${startEspace}]*?${end}))`,flag);
  //     return StringUtils.regexExec(reg, data);
  // }
  // public static betweenRegexpStrGroup(start: string, end: string, data: string, flag = 'gm') {
  //     const startEspace = StringUtils.escapeSpecialCharacterRegExp(start);
  //     const reg = RegExp(`(?:${start}(?:((?:${start})??[^${startEspace}]*?)${end}))`,flag);
  //     return StringUtils.regexExec(reg, data);
  // }
  // public static between(start: string, end: string, data: string, flag = 'gm') {
  //     // (\$\{(?:\[??[^\[]*?\})), (\$\{(?:(\$\{)??[^\$\{]*?\}))
  //     start = StringUtils.escapeSpecialCharacterRegExp(start);
  //     end = StringUtils.escapeSpecialCharacterRegExp(end);
  //     const reg = RegExp(`(${start}(?:(${start})??[^${start}]*?${end}))`,flag);
  //     return StringUtils.regexExec(reg, data);
  // }

  public static escapeSpecialCharacterRegExp(data: string) {
    return data.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  // public static betweenReplace(start: string, end: string, message: string, replace: string) {
  //     const regex = RegExp('([^(dr\\-)])?this(?=.?)', 'gm');
  //     StringUtils.regexExec(regex, message).reverse().forEach(it => {
  //         message = message.substr(0, it.index) + message.substr(it.index).replace(it[0], `${it[1] ?? ''}${drThis}`);
  //     })
  // }
}
