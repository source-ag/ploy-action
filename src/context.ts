import * as os from 'os'
import * as core from '@actions/core'

export const osPlat: string = os.platform()
export const osArch: string = os.arch()

export interface Inputs {
  version: string
  deploymentFile: string
  command: string
  updateService: string | undefined
  updateVersion: string | undefined
  updateAuthorName: string | undefined
  updateAuthorEmail: string | undefined
  updateCommitMessage: string | undefined
  updateBranch: string | undefined
}

const getInputOrUndefined = (name: string): string | undefined => {
  const rawInput = core.getInput(name)
  return rawInput === '' ? undefined : rawInput
}

export const getInputs = (): Inputs => ({
  version: core.getInput('version'),
  deploymentFile: core.getInput('deployment-file'),
  command: core.getInput('command'),
  updateService: getInputOrUndefined('update-service'),
  updateVersion: getInputOrUndefined('update-version'),
  updateAuthorName: getInputOrUndefined('update-author-name'),
  updateAuthorEmail: getInputOrUndefined('update-author-email'),
  updateCommitMessage: getInputOrUndefined('update-commit-message'),
  updateBranch: getInputOrUndefined('update-branch')
})
