import * as core from '@actions/core'
import * as context from './context'
import * as ploy from './ploy'

async function run(): Promise<void> {
  try {
    core.debug('Getting inputs...')
    const inputs = await context.getInputs()
    await ploy.install(inputs.version)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
