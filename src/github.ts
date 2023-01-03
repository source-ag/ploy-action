import * as semver from 'semver'
import * as core from '@actions/core'
import * as httpm from '@actions/http-client'
import {BearerCredentialHandler} from '@actions/http-client/lib/auth'
import {RequestHandler} from '@actions/http-client/lib/interfaces'

export interface GitHubRelease {
  id: number
  tag_name: string
}

export const getRelease = async (version: string, token?: string): Promise<GitHubRelease | null> => {
  const resolvedVersion: string = (await resolveVersion(version, token)) || version
  core.debug(`Version '${version}' resolved as '${resolvedVersion}'`)
  const url = `https://github.com/DonDebonair/ploy/releases/${resolvedVersion}`

  const http = getHttpClient(token)
  return (await http.getJson<GitHubRelease>(url)).result
}

const getHttpClient = (token?: string): httpm.HttpClient => {
  let requestHandlers: RequestHandler[] = []
  if (token !== undefined) {
    const credentialHandler: BearerCredentialHandler = new BearerCredentialHandler(token)
    requestHandlers = [credentialHandler]
  }
  return new httpm.HttpClient('ploy-action', requestHandlers)
}

const resolveVersion = async (version: string, token?: string): Promise<string | null> => {
  core.debug(`Resolving version '${version}'`)
  const allTags: string[] = await getAllTags(token)
  if (!allTags) {
    throw new Error(`Cannot find Ploy tags`)
  }
  core.debug(`Found ${allTags.length} tags in total`)

  if (version === 'latest') {
    return semver.maxSatisfying(allTags, '*')
  }
  return version
}

interface GitHubTag {
  tag_name: string
}

const getAllTags = async (token?: string): Promise<string[]> => {
  core.debug('Getting all tags')
  const http = getHttpClient(token)
  const url = 'https://api.github.com/repos/DonDebonair/ploy/releases'
  const getTags = http.getJson<GitHubTag[]>(url)
  const tagsResponse = await getTags
  if (tagsResponse.result == null) {
    return []
  } else {
    return tagsResponse.result.map(o => o.tag_name)
  }
}
