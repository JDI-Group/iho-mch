import { createConnector } from 'wagmi'
import { injected } from 'wagmi/connectors'

function getExplicitInjectedProvider(flag: any) {
  const _window = typeof window !== 'undefined' ? window : void 0
  if (typeof _window === 'undefined' || typeof _window.ethereum === 'undefined')
    return
  const providers = _window.ethereum.providers
  return providers
    ? providers.find((provider: any) => provider[flag])
    : _window.ethereum[flag] ? _window.ethereum : void 0
}
function getWindowProviderNamespace(namespace: any) {
  const providerSearch = (provider: any, namespace2: any) => {
    const [property, ...path] = namespace2.split('.')
    const _provider = provider[property]
    if (_provider) {
      if (path.length === 0)
        return _provider
      return providerSearch(_provider, path.join('.'))
    }
  }
  if (typeof window !== 'undefined')
    return providerSearch(window, namespace)
}

function hasInjectedProvider({ flag, namespace }: any) {
  if (namespace && typeof getWindowProviderNamespace(namespace) !== 'undefined')
    return true
  if (flag && typeof getExplicitInjectedProvider(flag) !== 'undefined')
    return true
  return false
}

function getInjectedProvider({ flag, namespace }: any) {
  const _window = typeof window !== 'undefined' ? window : void 0
  if (typeof _window === 'undefined')
    return
  if (namespace) {
    const windowProvider = getWindowProviderNamespace(namespace)
    if (windowProvider)
      return windowProvider
  }
  const providers = _window.ethereum?.providers
  if (flag) {
    const provider = getExplicitInjectedProvider(flag)
    if (provider)
      return provider
  }
  if (typeof providers !== 'undefined' && providers.length > 0)
    return providers[0]
  return _window.ethereum
}

function createInjectedConnector(provider: any) {
  return (walletDetails: any) => {
    const injectedConfig = provider
      ? {
          target: () => ({
            id: walletDetails.rkDetails.id,
            name: walletDetails.rkDetails.name,
            provider,
          }),
        }
      : {}
    return createConnector(config => ({
      // Spread the injectedConfig object, which may be empty or contain the target function
      ...injected(injectedConfig)(config),
      ...walletDetails,
    }))
  }
}

function getInjectedConnector({ flag, namespace, target }: any) {
  const provider = target || getInjectedProvider({ flag, namespace })
  return createInjectedConnector(provider)
}

export {
  getInjectedConnector,
  hasInjectedProvider,
}
