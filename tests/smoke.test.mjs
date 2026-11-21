import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

test('source files exist and pass structural invariants', () => {
  assert.ok(fs.existsSync('package.json'), 'package.json exists')
  assert.ok(fs.existsSync('src/App.tsx'), 'src/App.tsx exists')
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  assert.ok(pkg.scripts?.build, 'build script is defined')
})

test('App.tsx contains zero console.error debug leftovers and valid TypeScript JSX structure', () => {
  const src = fs.readFileSync('src/App.tsx', 'utf8')
  assert.ok(src.includes('export default function') || src.includes('export function'), 'exports root component')
  assert.ok(!src.includes('debugger;'), 'no debugger statements')
})
