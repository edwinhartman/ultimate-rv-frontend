function addStyles(win, styles) {
  styles.forEach((style) => {
    let link = win.document.createElement("link")
    link.setAttribute("rel", "stylesheet")
    link.setAttribute("type", "text/css")
    link.setAttribute("href", style)
    win.document.getElementsByTagName("head")[0].appendChild(link)
  })
}
function addRawStyles(win, styles) {
  let s = win.document.createElement("style")
  s.setAttribute("type", "text/css")
  styles.forEach((style) => {
    s.innerHTML += style
  })
  win.document.getElementsByTagName("head")[0].appendChild(s)
}

const VueHtmlToPaper = {
  install(app, options = {}) {
    app.config.globalProperties.$htmlToPaper = (el, localOptions, cssIdx, cb = () => true) => {
      // console.log(localOptions)
      let defaultStyles = []
      let { styles = defaultStyles } = options

      // If has localOptions
      // TODO: improve logic

      let print_title = window.document.title

      if (localOptions) {
        if (localOptions.styles) {
          styles = localOptions.styles
        }
        if (localOptions.windowTitle) {
          print_title = localOptions.windowTitle
        }
        // if (localOptions.StyleSheetList && cssIdx != null){
        //     styles = []

        //   for (let j=0;j<localOptions.StyleSheetList[cssIdx].cssRules.length;j++){
        //       styles.push(localOptions.StyleSheetList[cssIdx].cssRules[j].cssText)
        //   }

        // }
      }

      const element = window.document.getElementById(el)

      if (!element) {
        alert(`Element to print #${el} not found!`)
        return
      }

      var ifprint = document.createElement("iframe")

      document.body.appendChild(ifprint)

      ifprint.setAttribute("style", "height:0;width:0;")

      const win = ifprint.contentWindow

      win.document.write(`
          <html>
            <head>
              <title>${print_title}</title>
            </head>
            <body>
              ${element.innerHTML}
            </body>
          </html>
        `)

      if (localOptions.StyleSheetList) {
        addRawStyles(win, styles)
      } else {
        addStyles(win, styles)
      }

      setTimeout(() => {
        win.document.close()
        win.focus()
        win.print()
        win.close()
        document.body.removeChild(ifprint)
        cb()
      }, 1)

      return true
    }
  },
}

export default VueHtmlToPaper
