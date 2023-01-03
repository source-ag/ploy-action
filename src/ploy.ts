import * as path from 'path'
import * as util from 'util'
import * as context from './context'
import * as github from './github'
import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'

export const install = async (version: string): Promise<string> => {
  const githubToken = core.getInput('github-token')
  if (githubToken === '') {
    core.warning('No github-token supplied, API requests will be subject to stricter rate limiting')
  }
  const release: github.GitHubRelease | null = await github.getRelease(version, githubToken)
  if (!release) {
    throw new Error(`Cannot find Ploy ${version} release`)
  }

  const filename = getFilename(release.tag_name)
  const downloadUrl = util.format(
    'https://github.com/DonDebonair/ploy/releases/download/%s/%s',
    release.tag_name,
    filename
  )

  core.info(`Downloading ${downloadUrl}`)
  const authHeader = githubToken === '' ? undefined : `token ${githubToken}`
  const downloadPath: string = await tc.downloadTool(downloadUrl, undefined, authHeader)
  core.debug(`Downloaded to ${downloadPath}`)

  core.info('Extracting Ploy')
  let extPath: string
  if (context.osPlat === 'win32') {
    extPath = await tc.extractZip(downloadPath)
  } else {
    extPath = await tc.extractTar(downloadPath)
  }
  core.debug(`Extracted to ${extPath}`)

  const cachePath: string = await tc.cacheDir(extPath, 'ploy-action', release.tag_name.replace(/^v/, ''))
  core.debug(`Cached to ${cachePath}`)

  const exePath: string = path.join(cachePath, context.osPlat === 'win32' ? 'ploy.exe' : 'ploy')
  core.debug(`Exe path is ${exePath}`)

  return exePath
}

const getFilename = (version: string): string => {
  let arch: string
  switch (context.osArch) {
    case 'x64': {
      arch = 'x86_64'
      break
    }
    case 'x32': {
      arch = 'i386'
      break
    }
    case 'arm': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const arm_version = (process.config.variables as any).arm_version
      arch = arm_version ? `armv${arm_version}` : 'arm'
      break
    }
    default: {
      arch = context.osArch
      break
    }
  }
  if (context.osPlat === 'darwin') {
    arch = 'all'
  }
  const platform: string = context.osPlat === 'win32' ? 'windows' : context.osPlat === 'darwin' ? 'mac' : 'linux'
  const ext: string = context.osPlat === 'win32' ? 'zip' : 'tar.gz'
  return util.format('ploy_%s_%s_%s.%s', version.replace(/^v/, ''), platform, arch, ext)
}
