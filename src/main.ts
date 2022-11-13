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
    const command = `${bin} ${inputs.command} ${inputs.deploymentFile}`
    await exec.exec(command, undefined, {})
    if (inputs.command === 'update') {
      if (inputs.updateService === undefined || inputs.updateVersion === undefined) {
        core.error("update-service and update-version have to be provided when using 'update' command")
      } else {
        await git.addCommitPushChanges(
          inputs.deploymentFile,
          inputs.updateService,
          inputs.updateVersion,
          inputs.updateBranch,
          inputs.updateCommitMessage
        )
      }
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
