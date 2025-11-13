<div id="top"></div>
<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="https://kornferry.papirfly.co.uk/readimage.aspx/asset.png?pubid=HHt8qo6JAprGqSvAg1KVkw" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">KF One Module Template</h3>

  <p align="center">
   This repo is build for `kfone-api-template` & `kfone-frontend-template`
  </p>
</div>

## Minimum System Requirements

- Download and install [VS Code](https://code.visualstudio.com/download).

- Minimal VS Code extensions required to be installed

  - [Conventional Commits](https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits)

  - [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

  - [Code-Spell-Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)

  - [GitHub Pull Requests](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github)

  - [GitLens — Git supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)

  - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

  - [Color Highlight](https://marketplace.visualstudio.com/items?itemName=naumovs.color-highlight)

  - [SVG](https://marketplace.visualstudio.com/items?itemName=jock.svg)

  - [Image preview](https://marketplace.visualstudio.com/items?itemName=kisstkondoros.vscode-gutter-preview)

  - [VSCode Icons](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons)

  - [Vitest](https://marketplace.visualstudio.com/items?itemName=vitest.explorer)

- Download and install [Node JS](https://nodejs.org/en/download/).\
  Required LTS version 20 and above.

- Download and install [Git Bash](https://git-scm.com/downloads)

## Creating Workspace Configuration

- Configure `settings.json` by creating new folder `.vscode` at root:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnPaste": true,
  // Runs Prettier, then ESLint
  "editor.codeActionsOnSave": ["source.formatDocument", "source.fixAll.eslint"],
  "conventionalCommits.scopes": [
    "api",
    "automation",
    "b2c",
    "database",
    "middleware",
    "npm",
    "schema",
    "test",
    "ui"
  ],
  "[typescript]": {
    "editor.inlayHints.enabled": "on"
  },
  //typescript
  "typescript.inlayHints.enumMemberValues.enabled": true,
  "typescript.inlayHints.parameterTypes.enabled": true,
  "typescript.inlayHints.propertyDeclarationTypes.enabled": true,
  "typescript.inlayHints.variableTypes.enabled": true,
  "typescript.inlayHints.variableTypes.suppressWhenTypeMatchesName": true,
  "typescript.inlayHints.functionLikeReturnTypes.enabled": true
}
```

## Conventional Commit Guidelines

In order to maintain consistency and clarity in commit messages, we adhere to the Conventional commit format, also check for best practices & branch naming strategies.\
For detailed information on these guidelines, please refer [Conventional Commits](https://kornferry.atlassian.net/wiki/spaces/KDR/pages/774504509/Conventional+Commits)

Kindly refrain from using the `"--no-verify"` flag while committing code

## Installation of npm packages

In order to execute `npm i` command, you need to add below kfone-app access key in .npmrc file for backend & frontend.

```
//kfydigital.jfrog.io/artifactory/api/npm/kf1-npm-virtual/:_auth="<kfone-app-key>"
```

Note:

1.  The key must not be committed to repository
2.  Do not commit package-lock.json if there are no changes in your package.json

Example: Complete .npmrc file.

```
always-auth=true
registry=https://kfydigital.jfrog.io/artifactory/api/npm/kf1-npm-virtual/
//kfydigital.jfrog.io/artifactory/api/npm/kf1-npm-virtual/:_auth="<kfone-app-key>"
```

## DevOps Team Dependent Items - Backend/Frontend CI

- moduleChartName
- moduleChartVersion
- namespace
- ingressGroupName
- certificateArn

```
Note: We need to reach out to [Rajkishor Azad](rajkishor.azad@kornferry.com) or [Anish Gupta](anish.gupta@kornferry.com)
```

## Contact

### Korn Ferry

- [Balachandar Sangaiah](balachandar.sangaiah@kornferry.com)

<!--Team Name & Members ->
<!-- LICENSE -->

## License

_TBD_

## Terms and Conditions & Privacy

Please refer to Korn Ferry website

- [Terms and Conditions](https://www.kornferry.com/terms).
- [Privacy](https://www.kornferry.com/privacy).

<p align="right">(<a href="#top">back to top</a>)</p>
