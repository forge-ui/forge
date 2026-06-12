/**
 * L2 narrowed checks — targeted prop / usage checks beyond raw grep.
 * v0 uses enhanced regex (no @babel/parser dep). Migrate to real AST
 * if rule count exceeds ~20 or rules need scope/binding analysis.
 */

import { readFileSync } from 'node:fs'
import { relative } from 'node:path'

const LABEL_COLORS = ['purple', 'blue', 'cyan', 'green', 'red', 'yellow', 'gray']

const RULES = [
  {
    name: 'statusbadge-uses-children',
    description: 'StatusBadge takes label= prop, not children',
    custom: (content) => {
      const hits = []
      const re = /<StatusBadge\b[^>]*>([^<]*)<\/StatusBadge>/g
      let m
      while ((m = re.exec(content)) !== null) {
        const inner = m[1].trim()
        if (inner.length > 0 && !inner.startsWith('{')) hits.push(m.index)
      }
      return hits
    },
    status: 'critical',
    repairHint: 'Move the inner text into a `label=` prop. Change `<StatusBadge color="green">Active</StatusBadge>` to `<StatusBadge label="Active" color="green" />`.',
  },
  {
    name: 'progress-statcard-progress-prop',
    description: 'ProgressStatCard takes progressValue=, not progress=',
    pattern: /<ProgressStatCard\b[^>]*\sprogress=(?!Value)/,
    status: 'critical',
    repairHint: 'Rename `progress=` to `progressValue=` on <ProgressStatCard>. Keep the value identical.',
  },
  {
    name: 'statusbadge-size-prop',
    description: 'StatusBadge has no size prop',
    pattern: /<StatusBadge\b[^>]*\ssize=/,
    status: 'critical',
    repairHint: 'Remove `size=` prop from <StatusBadge> — the component has no size prop.',
  },
  {
    name: 'listgroup-bad-color',
    description: 'ListGroup color must be purple | blue | black',
    custom: (content) => {
      const hits = []
      const re = /<ListGroup\b[^>]*\scolor=["']([^"']+)["']/g
      let m
      while ((m = re.exec(content)) !== null) {
        if (!['purple', 'blue', 'black'].includes(m[1])) hits.push(m.index)
      }
      return hits
    },
    status: 'critical',
    repairHint: 'Change <ListGroup color="..."> to one of the allowed values: purple | blue | black.',
  },
  {
    name: 'statcard-bad-size',
    description: 'StatCard size must be sm | lg | wide',
    custom: (content) => {
      const hits = []
      const re = /<StatCard\b[^>]*\ssize=["']([^"']+)["']/g
      let m
      while ((m = re.exec(content)) !== null) {
        if (!['sm', 'lg', 'wide'].includes(m[1])) hits.push(m.index)
      }
      return hits
    },
    status: 'critical',
    repairHint: 'StatCard 只接受 size="sm"、size="lg" 或 size="wide"。不要凭印象写 md/xs/xl，先 grep core 或 registry 确认。',
  },
  {
    name: 'statcard-label-prop',
    description: 'StatCard takes title= prop, not label=',
    pattern: /<StatCard\b[^>]*\slabel=/,
    status: 'critical',
    repairHint: 'Rename `label=` to `title=` on <StatCard>. Keep the value identical.',
  },
  {
    name: 'statcard-numeric-value',
    description: 'StatCard value must be a string, not a numeric JSX literal',
    pattern: /<StatCard\b[^>]*\svalue=\{\s*-?\d+(?:\.\d+)?\s*\}/,
    status: 'critical',
    repairHint: 'Change numeric StatCard values to strings, e.g. `value="120"` instead of `value={120}`.',
  },
  {
    name: 'label-bad-color',
    description: 'Label color must be purple | blue | cyan | green | red | yellow | gray',
    custom: (content) => {
      const hits = []
      const re = /<Label\b[^>]*\scolor=["']([^"']+)["']/g
      let m
      while ((m = re.exec(content)) !== null) {
        if (!LABEL_COLORS.includes(m[1])) hits.push(m.index)
      }
      return hits
    },
    status: 'critical',
    repairHint: 'Change <Label color="..."> to one of: purple | blue | cyan | green | red | yellow | gray. Do not use orange/black on Label.',
  },
  {
    name: 'toolbar-search-controlled-props',
    description: 'ToolbarSearchInput has no value/onValueChange props',
    pattern: /<ToolbarSearchInput\b[^>]*\s(?:value|onValueChange)=/,
    status: 'critical',
    repairHint: 'Remove controlled props from <ToolbarSearchInput>. For live search, use a native `<input>` styled with forge tokens.',
  },
  {
    name: 'datatable-column-label',
    description: 'DataTable ColumnDef uses header:, not label:',
    custom: (content) => {
      const hits = []
      const re = /<DataTable\b[\s\S]*?columns=\{\[([\s\S]*?)\]\}/g
      let m
      while ((m = re.exec(content)) !== null) {
        if (/\blabel\s*:/.test(m[1])) hits.push(m.index)
      }
      return hits
    },
    status: 'critical',
    repairHint: 'Rename `label:` to `header:` inside DataTable column definitions. Keep display text unchanged.',
  },
  {
    name: 'buttongroup-too-many-items',
    description: 'ButtonGroup should not carry more than 5 segments',
    custom: (content) => findOverloadedButtonGroups(content),
    status: 'critical',
    repairHint: 'ButtonGroup 分段项超过 5 个会造成筛选项挤压、换行和间距不稳。按业务语义拆成多个 ButtonGroup（例如 active queue / terminal outcomes），或改用 TabBar / FilterPanel；不要只靠 className="flex-wrap" 硬塞。',
  },
]

const ARRAY_DECL_RE = /const\s+([A-Za-z_$][\w$]*)\s*(?::[^=]+)?=\s*(\[[\s\S]*?\])(?:\s+as\s+const)?/g

function lineOf(content, index) {
  return content.slice(0, index).split('\n').length
}

function findOverloadedButtonGroups(content) {
  const hits = []
  const arrays = collectArrayLengths(content)
  const re = /<ButtonGroup\b[\s\S]*?\/>/g
  let m
  while ((m = re.exec(content)) !== null) {
    const tag = m[0]
    const count = inferButtonGroupItemCount(tag, arrays)
    if (count > 5) hits.push(m.index)
  }
  return hits
}

function collectArrayLengths(content) {
  const arrays = new Map()
  let m
  while ((m = ARRAY_DECL_RE.exec(content)) !== null) {
    const length = countArrayItems(m[2])
    if (length > 0) arrays.set(m[1], length)
  }
  return arrays
}

function inferButtonGroupItemCount(tag, arrays) {
  const mapMatch = tag.match(/items=\{\s*([A-Za-z_$][\w$]*)\.map\(/)
  if (mapMatch) return arrays.get(mapMatch[1]) ?? 0

  const inlineMatch = tag.match(/items=\{\s*(\[[\s\S]*?\])\s*\}/)
  if (inlineMatch) return countInlineButtonItems(inlineMatch[1])

  return 0
}

function countInlineButtonItems(value) {
  const labelHits = value.match(/\blabel\s*:/g)
  if (labelHits) return labelHits.length
  return countArrayItems(value)
}

function countArrayItems(value) {
  const inner = value.trim().replace(/^\[/, '').replace(/\]$/, '').trim()
  if (!inner) return 0
  let depth = 0
  let count = 1
  let quote = null
  for (let i = 0; i < inner.length; i += 1) {
    const char = inner[i]
    const prev = inner[i - 1]
    if (quote) {
      if (char === quote && prev !== '\\') quote = null
      continue
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char
      continue
    }
    if (char === '[' || char === '{' || char === '(') depth += 1
    else if (char === ']' || char === '}' || char === ')') depth -= 1
    else if (char === ',' && depth === 0) count += 1
  }
  return count
}

export function checkL2Ast(targetDir, files) {
  const results = []
  for (const rule of RULES) {
    const hits = []
    for (const file of files) {
      let content
      try { content = readFileSync(file, 'utf8') } catch { continue }

      if (rule.custom) {
        for (const idx of rule.custom(content)) {
          hits.push(`${relative(targetDir, file)}:${lineOf(content, idx)}`)
        }
        continue
      }

      const flags = rule.pattern.flags.includes('g') ? rule.pattern.flags : rule.pattern.flags + 'g'
      const pat = new RegExp(rule.pattern.source, flags)
      let m
      while ((m = pat.exec(content)) !== null) {
        hits.push(`${relative(targetDir, file)}:${lineOf(content, m.index)}`)
      }
    }
    results.push({
      level: 'L2',
      name: rule.name,
      description: rule.description,
      status: hits.length ? rule.status : 'pass',
      files: hits,
      repairHint: hits.length ? rule.repairHint : undefined,
    })
  }
  return results
}
