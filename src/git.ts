import {simpleGit} from 'simple-git'

export const addCommitPushChanges = async (
  deploymentFile: string,
  serviceId: string,
  version: string,
  branch: string | undefined,
  commitMessage: string | undefined
): Promise<void> => {
  const git = simpleGit()
  if (branch !== undefined) {
    git.checkout(branch)
  }
  await git.add(deploymentFile)
  const finalCommitMessage = commitMessage ? commitMessage : `ci: update ${serviceId} to version ${version}`
  await git.commit(finalCommitMessage)
  await git.push(undefined, branch)
}
