import { NamedModulesPlugin, NoEmitOnErrorsPlugin, HashedModuleIdsPlugin, DefinePlugin } from 'webpack'

import  CleanWebpackPlugin from 'clean-webpack-plugin'

export const cleanPlugin = ({ path, root }) => ({
  plugins: [
    new CleanWebpackPlugin(path, { root }),
  ],
})

export const noErrorsPlugin = () => ({
  plugins: [
    new NoEmitOnErrorsPlugin,
  ],
})

export const namedModulesPlugin = () => ({
  plugins: [
    new NamedModulesPlugin,
  ],
})

export const hashedModuleIdsPlugin = () => ({
  plugins: [
    new HashedModuleIdsPlugin,
  ],
})

export const definePlugin = obj => ({
  plugins: [
    new DefinePlugin(obj),
  ],
})
