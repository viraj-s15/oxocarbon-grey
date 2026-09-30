# Publishing to Open VSX

These steps publish the extension to [open-vsx.org](https://open-vsx.org). They only need to be done once, except the last step.

## 1. Accounts

1. Create an [Eclipse Foundation account](https://accounts.eclipse.org/user/register). Put your GitHub username in the account's **GitHub Username** field.
2. Log in to [open-vsx.org](https://open-vsx.org) with GitHub.
3. On your Open VSX profile page, click **Log in with Eclipse** and sign the **Publisher Agreement**.

## 2. Access token

On open-vsx.org, go to **Settings → Access Tokens**, generate a token and store it somewhere safe. The commands below read it from `$OVSX_PAT`:

```sh
export OVSX_PAT=...
```

## 3. Namespace

The namespace must match the `publisher` field in `package.json` (currently `viraj-s15`). Create it once:

```sh
npx ovsx create-namespace viraj-s15 -p $OVSX_PAT
```

A new namespace is unverified. To get it verified (and remove the warning on the extension page), [open a namespace ownership claim](https://github.com/EclipseFdn/open-vsx.org/issues/new/choose) on the open-vsx.org repository.

## 4. Package and publish

```sh
npm run package                       # builds the theme and creates oxocarbon-grey-<version>.vsix
npx ovsx publish *.vsix -p $OVSX_PAT
```

For later releases, bump `version` in `package.json`, add a `CHANGELOG.md` entry, and repeat step 4.

## Publishing from GitHub Actions

`.github/workflows/publish.yml` publishes when a `v*` tag is pushed. It needs a repository secret named `OVSX_PAT` (**Settings → Secrets and variables → Actions**). Then:

```sh
git tag v0.1.0
git push origin v0.1.0
```

The workflow checks that the tag matches the `version` in `package.json`, that the committed theme is up to date, then packages and publishes the `.vsix` and attaches it to the run as an artifact.
