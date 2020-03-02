# @ronas-it/docs-tool

The tool for generation docs according to Ronas IT internal rules.

## Usage

````
Usage: docs-tool <command> [options]

Commands:
  docs-tool
  docs-tool module:init [name]
  docs-tool module:update
  docs-tool module:sidebar-update
  docs-tool build:init <modules..>
  docs-tool build:update
  docs-tool doc:create [type] [title]
  docs-tool build:module:add <module>
  docs-tool build:module:remove <module>

Options:
  --version   Show version number
  -h, --help  Show help

Examples:
  docs-tool module:init Staff               Create module
  docs-tool module:init Angular --tech      Create tech module
  docs-tool module:update                   Update module
  docs-tool module:sidebar-update           Update module's sidebar
  docs-tool build:init module1 module2      Create build from modules
  docs-tool build:update                    Update build
  docs-tool doc:create strategy "Strategy"  Create strategy
  docs-tool doc:create execution            Create execution
  "Execution"
  docs-tool doc:create control "Control"    Create control
  docs-tool doc:create instruction          Create instruction
  "Instruction"
  docs-tool build:module:add doc            Add doc module
  docs-tool build:module:remove doc         Remove doc module
````
