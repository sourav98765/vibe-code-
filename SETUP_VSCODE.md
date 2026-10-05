# Run Smart Escape in VS Code, publish to GitHub, and host on Firebase

This package is prepared for your own PC. The supplied official East Annex building dataset is already included. Firebase Hosting serves only the `dist` directory. Your PC performs the account sign-in and deployment.

## 1. Install the tools

Install Visual Studio Code, Node.js LTS, and Git. Restart VS Code after installing Node.js or Git so the terminal can find them.

- VS Code: https://code.visualstudio.com/
- Node.js LTS: https://nodejs.org/en/download
- Git: https://git-scm.com/

Extract the ZIP. In VS Code use File > Open Folder and choose the inner `Smart_Escape` folder containing `package.json`, `firebase.json`, and `dist`.

Use Terminal > New Terminal. On Windows, select Command Prompt in the terminal dropdown if PowerShell reports that scripts such as npm.ps1 cannot run. You do not need to change the execution policy.

Check installations:

```sh
node --version
npm --version
git --version
```

## 2. Run and test locally

There are no application dependencies to install and no build step.

```sh
npm start
```

Open http://localhost:8080. Do not open index.html by double-clicking because the app uses JavaScript modules. Stop the local server with Ctrl+C when needed.

Use a second terminal for tests:

```sh
npm test
```

Useful edit locations:

| File | Purpose |
| --- | --- |
| dist/index.html | Page structure |
| dist/style.css | Appearance |
| dist/app.js | Controls, map and English/Bangla text |
| dist/core.js | Input validation and route calculation |
| dist/building.json | Downloadable official sample |
| dist/sample.js | Same sample embedded for initial loading |
| firebase.json | Firebase Hosting configuration |

After editing, refresh your browser. Keep `sample.js` and `building.json` synchronized if changing the default dataset; the test suite checks that they match.

## 3. Publish to GitHub using VS Code

Open Source Control with Ctrl+Shift+G and select Initialize Repository. If Git is not found, restart VS Code after installing it.

If Git asks for identity, run these commands in the terminal, using your own name and commit email:

```sh
git config user.name "YOUR NAME"
git config user.email "YOUR COMMIT EMAIL"
```

These values identify commits; they do not sign you into GitHub. A GitHub-provided no-reply email can be used for commit privacy.

Stage the files with the + control next to Changes. Enter a commit message such as:

`Add Smart Escape simulator; AI prompt: solve that`

Select Commit, then Publish Branch / Publish to GitHub. Complete GitHub sign-in in your own browser if asked. Use a public repository named `devfest-YOUR_REGISTRATION_NUMBER` for the competition, or `smart-escape` for personal practice. Choose the public visibility option and confirm the published repository contains the source, tests, README, MIT LICENSE and firebase.json.

If you prefer terminal commands, first create an EMPTY GitHub repository in your account. Leave its README, .gitignore and license options unchecked because these files are already included here. Then run the following from the project folder. Use this route instead of the Publish to GitHub button, and replace the placeholders:

```sh
git init
git config user.name "YOUR NAME"
git config user.email "YOUR COMMIT EMAIL"
git add .
git commit -m "Add Smart Escape simulator; AI prompt: solve that"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Complete GitHub authentication when prompted. If Git reports that origin already exists, inspect `git remote -v` rather than adding another origin or overwriting it blindly.

For future changes:

```sh
git add .
git commit -m "Describe your change; Manual edit"
git push
```

## 4. Create or select a Firebase project

Open https://console.firebase.google.com/ in your own browser. Create a project for Smart Escape, or choose a project whose default Hosting site you intend to update. Record its PROJECT ID, which can differ from the display name. Hosting setup uses classic Firebase Hosting for this static app. Google Analytics is optional.

Deploying to an existing project's default site replaces that site's current release. Use a new project if you want a separate website.

In the VS Code terminal, install the official Firebase CLI and sign in:

```sh
npm install -g firebase-tools
firebase login
firebase projects:list
```

Complete Google sign-in in your own browser. The final command lists your available project IDs.

## 5. Deploy

The Firebase configuration is already supplied and points to `dist`. You can deploy without running `firebase init hosting`. Replace YOUR_PROJECT_ID with the exact ID from the projects list:

```sh
firebase deploy --only hosting --project YOUR_PROJECT_ID
```

The command prints the Hosting URL after successful deployment. Open that returned URL and verify the five sample scenarios. The default Firebase Hosting URLs typically use your project ID on web.app and firebaseapp.com; use the actual URL printed by the CLI.

If the console requests initial Hosting setup, complete its Get started flow for Hosting. If you choose to run `firebase init hosting`, use the following answers to preserve the supplied application:

| Prompt | Answer |
| --- | --- |
| Project | Use your intended existing Firebase project |
| Public directory | dist |
| Single-page app rewrite | No; this app has one page and no client-side URL routes |
| Automatic GitHub deployment | No for this first manual deployment |
| Overwrite dist/index.html | No |

After future edits, run tests, commit/push, and deploy again:

```sh
npm test
git add .
git commit -m "Describe your change; Manual edit"
git push
firebase deploy --only hosting --project YOUR_PROJECT_ID
```

## Optional: deploy automatically from GitHub

After GitHub publishing and a successful manual Firebase deploy, you can configure Firebase's official GitHub integration on your PC:

```sh
firebase init hosting:github --project YOUR_PROJECT_ID
```

Follow the CLI prompts for your repository. This creates a deployment service account, stores its key as a GitHub Actions secret, and writes workflow files. Review the permissions during setup. This app needs no build command; a workflow can run `npm test` before deploying the already-existing `dist` folder. Commit and push the generated workflows. Keys belong in GitHub Secrets, never source files.

## Competition submission checklist

Fill your real name, registration number, GitHub repository URL, Firebase live URL and final commit ID in README.md. Add actual browser screenshots:

- screenshots/baseline.png: R1 -> C1 -> C2 -> E1, cost 7.
- screenshots/rerouting-C2.png: C2 blocked; R1 -> C1 -> C3 -> C4 -> E2, cost 11.

During an actual timed event, follow its full rulebook and commit schedule. This preparation archive does not create an event-compliant history or replace the required three timed commits. Do not backdate or rewrite history.

## Common errors

- node/npm/git not recognized: install the relevant tool and restart VS Code.
- npm.ps1 cannot run: use Command Prompt as the VS Code terminal profile.
- firebase not recognized: run `npm install -g firebase-tools`, restart the terminal and run `firebase --version`.
- Project not found or insufficient permissions: confirm `firebase projects:list` shows the intended ID and account.
- A Firebase welcome page appears: check firebase.json has public set to dist and that dist/index.html contains Smart Escape. Deploy again.
- GitHub push rejected: confirm you created an empty repository and inspect the remote. Do not use force push to discard someone else's commits.

Official references:

- https://code.visualstudio.com/docs/sourcecontrol/github
- https://firebase.google.com/docs/cli
- https://firebase.google.com/docs/hosting/quickstart
- https://firebase.google.com/docs/hosting/github-integration
