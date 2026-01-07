export interface LoaderOptions {
  key: string
  src: string
  addCalToWindow?: boolean
  timeout?: number
}

let isScriptLoaded = false

export function loader(options: LoaderOptions): Promise<void> {
  const {
    key,
    src,
    addCalToWindow = true,
    timeout = 10000,
  } = options

  if (isScriptLoaded && window.BMapGL) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.type = 'text/javascript'
    script.defer = true

    const cleanup = () => {
      script.onload = null
      script.onerror = null
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }

    const timer = setTimeout(() => {
      cleanup()
      reject(new Error(`Script load timeout: ${src}`))
    }, timeout)

    const handleLoad = () => {
      clearTimeout(timer)
      isScriptLoaded = true
      cleanup()
      resolve()
    }

    if (addCalToWindow) {
      (window as any)[key] = handleLoad
    } else {
      script.onload = handleLoad
    }

    script.onerror = () => {
      clearTimeout(timer)
      cleanup()
      reject(new Error(`Failed to load script: ${src}`))
    }

    document.body.appendChild(script)
  })
}

export function listToMapPoints(points?: BMapGL.Point[] | number[][] | string[]): BMapGL.Point[] {
  if (!points || points.length === 0) {
    return []
  }

  const first = points[0]

  if (Array.isArray(first)) {
    return (points as number[][]).map(([lng, lat]) => new BMapGL.Point(lng, lat))
  }

  if (typeof first === 'string') {
    return points as BMapGL.Point[]
  }

  return points as BMapGL.Point[]
}
