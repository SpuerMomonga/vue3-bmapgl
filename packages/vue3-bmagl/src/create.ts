import type { App, Component, DefineComponent } from 'vue'

type ComponentType = any

export interface NUiInstance {
  componentPrefix: string
  install: (app: App) => void
}

interface NUiCreateOptions {
  components?: ComponentType[]
  componentPrefix?: string
}

function create({
  componentPrefix = 'B',
  components = [],
}: NUiCreateOptions = {}): NUiInstance {
  const installTargets: App[] = []
  function registerComponent(
    app: App,
    name: string,
    component: ComponentType,
  ): void {
    const registered = app.component(componentPrefix + name)
    if (!registered) {
      app.component(
        componentPrefix + name,
        component as Component<any> | DefineComponent<any>,
      )
    }
  }
  function install(app: App): void {
    if (installTargets.includes(app))
      return
    installTargets.push(app)
    components.forEach((component) => {
      const { name, alias } = component
      registerComponent(app, name as string, component)
      if (alias) {
        alias.forEach((aliasName: string) => {
          registerComponent(app, aliasName, component)
        })
      }
    })
  }
  return {
    componentPrefix,
    install,
  }
}

export default create
