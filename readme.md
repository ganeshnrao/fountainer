# Fountainer

Fountainer is a Javascript CLI tool to convert screenplays written using Fountain syntax into HTML files.

## Installation

To install the CLI globally run the following command.
```bash
npm install fountainer --global
```

To install the CLI for a specific project, run the following command.
```bash
npm install fountainer --save
```

## CLI Usage
The CLI tool can be used as follows.

```bash
fountainer -i myStory.fountain -o index.html
```

The tool accepts the following arguments

| Alias | Name | Description | Default |
| -- | -- | -- | -- |
| | `--version` | Show version number | |
| `-i` | `--inputFile` | complete path to Fountain file | |
| `-n` | `--keepNotes` | render notes from the fountain file | `false` |
| `-g` | `--gitLine` | render the draft number by counting the number of commits on the fountain file. This will only work if the file is part of a Git repository | `false` |
| `-l` | `--lineNumbers` | render line numbers corresponding to lines in the fountain file, must be one of "none" - don't print any line numbers, "all" - print all line numbers, "non-empty" - print line numbers only on non-empty lines | `"none"` |
| `-t` | `--titlePage` | render a title page | `true` |
| `-d` | `--debug` | render the inferred class on each line | `false` |
| `-v` | `--verbose` | print verbose logging to console | `false` |
| `-o` | `--outputFile` | complete path to output HTML file (required)
| `-s` | `--stylesPath` | path to a custom CSS or SCSS file | `"fountainer/parser/styles.scss"` |
| `-p` | `--templatePath` | path to a custom template, can be an EJS or HTML file | `"fountainer/parser/template.ejs"` |
| | `--help` | Show help | |

## Javascript API Usage
The tool also exports a javascript library, which can be used as follows.
```js
const fs = require('fs')
const fountainer = require('fountainer')

const parsed = fountainer.parse({ inputFile: 'myStory.fountain' })
const html = fountainer.toHtml(parsed)

fs.writeFileSync('index.html', html)
```

### `fountainer.parse(options)`
This method parses the input and generates an array of each line of the script.

### `fountainer.toHtml(parsed, options)`
This method generates an HTML string by using the result of the `parse` function.

### `options`
`options` for both the functions can have following properties.
```js
{
  inputFile: '',   // path to input file,
  inputString: '', // alternately you can provide the fountain string
  keepNotes: 'inline-notes', // name of class for notes
  gitLine: false,  // applicable only when inputFile is provided,
                   // pulls the git hash and number of commits on the
                   // inputFile and prints it as Draft number
  lineNumbers: 'none', // can be 'none', 'all', 'non-empty' see CLI usage above
  titlePage: true,
  debug: false,
  verbose: false,
  stylesPath: '',  // path to custom CSS/SCSS file
  templatePath: '' // path to custom EJS/HTML file
}
```

