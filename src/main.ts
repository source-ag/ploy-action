import * as core from '@actions/core'
import * as context from './context'
import * as ploy from './ploy'
import * as git from './git'
import * as exec from '@actions/exec'

const run = async (): Promise<void> => {
  try {
    core.debug('Getting inputs...')
    const inputs = context.getInputs()
    const bin = await ploy.install(inputs.version)
    if (inputs.command === 'update') {
      if (
        inputs.updateService === undefined ||
        inputs.updateVersion === undefined ||
        inputs.updateAuthorName === undefined ||
        inputs.updateAuthorEmail === undefined
      ) {
        core.error(
          "update-service, update-version, update-author-name and update-author-email have to be provided when using 'update' command"
        )
      } else {
        const command = `${bin} ${inputs.command} ${inputs.deploymentFile} ${inputs.updateService} ${inputs.updateVersion}`
        await exec.exec(command, undefined, {})
        // TODO: add git author (take from inputs)
        await git.addCommitPushChanges(
          inputs.deploymentFile,
          inputs.updateService,
          inputs.updateVersion,
          inputs.updateAuthorName,
          inputs.updateAuthorEmail,
          inputs.updateBranch,
          inputs.updateCommitMessage
        )
      }
    } else {
      const command = `${bin} ${inputs.command} ${inputs.deploymentFile}`
      await exec.exec(command, undefined, {})
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
