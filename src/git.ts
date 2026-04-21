import {simpleGit} from 'simple-git'

const MAX_PUSH_RETRIES = 3

export const addCommitPushChanges = async (
  deploymentFile: string,
  serviceId: string,
  version: string,
  authorName: string,
  authorEmail: string,
  branch: string | undefined,
  commitMessage: string | undefined
): Promise<void> => {
  const git = simpleGit()
  git.addConfig('user.name', authorName)
  git.addConfig('user.email', authorEmail)
  if (branch !== undefined) {
    git.checkout(branch)
  }
  await git.add(deploymentFile)
  const finalCommitMessage = commitMessage ? commitMessage : `ci: update ${serviceId} to version ${version}`
  await git.commit(finalCommitMessage)
  for (let attempt = 1; attempt <= MAX_PUSH_RETRIES; attempt++) {
    try {
      await git.push(undefined, branch)
      return
    } catch (err) {
      if (attempt === MAX_PUSH_RETRIES) throw err
      // Another concurrent update pushed first — rebase our commit on top and retry
      await git.pull('origin', branch, ['--rebase'])
    }
  }
}
