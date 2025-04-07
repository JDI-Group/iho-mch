/* eslint-disable ts/ban-ts-comment */
export function useAsyncCallbacks<T extends Record<string, (...args: any[]) => Promise<any>>>(
  callbacks: T,
) {
  const [status, setStatus] = useState({
    loading: false,
    loadings: {} as Record<keyof T, boolean>,
  })

  const actions = useMemo(
    () => Object.entries(callbacks).reduce((acc, [key, callback]) => {
      // @ts-expect-error
      acc[key] = async (...args: any[]) => {
        setStatus(prev => ({
          ...prev,
          loading: true,
          loadings: { ...prev.loadings, [key]: true },
        }))

        try {
          await callback(...args)
        }
        finally {
          setStatus(prev => ({
            ...prev,
            loading: false,
            loadings: { ...prev.loadings, [key]: false },
          }))
        }
      }
      return acc
    }, {} as { [K in keyof T]: (...args: Parameters<T[K]>) => ReturnType<T[K]> }),
    [callbacks],
  )

  return [status, actions] as const
}
