/**
 * 基本输出类
 */
class Console {
    constructor() {
        this.config = {
            delimiters: ['${','}'],
            templates: {}
        }
        this.regist = {}
    }

    static getType (param) {
        return Object.prototype.toString.call(param).slice(8, -1).toLowerCase()
    }

    static toStyle (style) {
        if (Console.getType(style) === 'string') return style
        return Object
            .entries(style)
            .reduce((style, item) => `${style}${item.join(": ")};`, '')
    }

    static warn (type, msg) {
        console.warn(`[${type}]: ${msg}`)
    }

    getConfig (conKey) {
        return conKey != null ? this.config[conKey] : this.config
    }

    setConfig (key, value) {
        this.config[key] = value
    }

    registTemp(templateName, template) {
        const {templates} = this.getConfig()
        if ([Console.getType(templateName), Console.getType(template)].every(type => type === 'string')) {
            templates[templateName] = template
        } else if (Console.getType(templateName) === 'object') {
            Object.assign(templates, templateName)
        } else {
            Console.warn('参数错误', 'templateName: String|Object   template: String')
        }
        return this
    }

    tranformTemplate (tempString, params, style) {
        const {delimiters = []} = this.config
        const templateRegExp = new RegExp(`\\${delimiters[0] || ''}(.+?)${delimiters[1] || ''}`, 'g')
        let match = templateRegExp.exec(tempString)
        const map = {}
        console.log('tempString', tempString)
        // todo: 解析字符串位置，添加 style
        while(match !== null) {
            tempString = tempString.replace(match[0], (_, order, $) => {
                const matchStr = match[1] ? `${params[match[1]]}` : ''
                map[order] = {
                    order,
                    str: matchStr,
                    len: matchStr.length,
                    range: [order, matchStr.length + order]
                }
                return matchStr
            })
            match = templateRegExp.exec(tempString)
        }
        console.log(tempString, map)
        return tempString
    }

    fillTemp (templateName, data, style = '') {
        const {[templateName]: template} = this.getConfig('templates')
        if (!template) {
            Console.warn('模板警告', `${template} 未注册，可调用 registTemp 方法进行注册模板`)
            return this
        }
        console.log('translate', this.tranformTemplate(template, data, style))
        return this.tranformTemplate(template, data)
    }

    hasCssLog (content, style) {
        return [`%c ${content}`, Console.toStyle(style)]
    }

    log (content, style = '') {
        console.log(`%c ${content}`, this.toStyle(style))
    }
}

export default Console