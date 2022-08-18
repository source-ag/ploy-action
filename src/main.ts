import * as core from '@actions/core'
import * as context from './context'
import * as ploy from './ploy'
import * as exec from '@actions/exec'

async function run(): Promise<void> {
  try {
    core.debug('Getting inputs...')
    const inputs = await context.getInputs()
    const bin = await ploy.install(inputs.version)
    const subCommand = inputs.verifyOnly ? 'verify -f' : 'deploy'
    const command = `${bin} ${subCommand} ${inputs.deploymentFile}`
    await exec.exec(command, undefined, {})
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
