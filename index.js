import core from '@actions/core'
import { ed25519 } from '@ucanto/principal'
import * as Client from '@web3-storage/w3up-client'
import { CarReader } from '@ipld/car'
import { importDAG } from '@ucanto/core/delegation'
import { filesFromPaths } from 'files-from-path'

const parseProof = async data => {
  const blocks = []
  const reader = await CarReader.fromBytes(Buffer.from(data, 'base64'))
  for await (const block of reader.blocks()) {
    blocks.push(block)
  }
  return importDAG(blocks)
}

const main = async () => {
  const path = core.getInput('path', { required: true })
  const privateKey = core.getInput('private-key', { required: true })
  const proofEncoded = core.getInput('proof', { required: true })

  const principal = ed25519.Signer.parse(privateKey)
  const web3Storage = await Client.create({ principal })
  const proof = await parseProof(proofEncoded)
  const space = await web3Storage.addSpace(proof)
  await web3Storage.setCurrentSpace(space.did())

  const cid = await web3Storage.uploadFile((await filesFromPaths([path]))[0])
  console.log(`Uploaded as ${cid}`)
  // core.setOutput('cid', cid.toString())
}

main().catch(err => core.setFailed(err.message))
